import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import {MachinesService} from '../machines.service';
@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  public type: string;
  // correlates to the seeMore pages
  public page: number;
  private machineData: ({ time: boolean; machines: any[] })[];
  private timeSlots: string[];
  private machinesPerPage: number;
  private selectedMachines: any[];
  public fromDate: string;
  public toDate: string;
  public reservationsMade: number;
  private allMachines: any;
  public showReserve: boolean;
  public showUndoReserve: boolean;
  private reservations: any;

  constructor(private route: ActivatedRoute, private machinesService: MachinesService) { }

  ngOnInit() {
    this.page = 0;
    this.machinesPerPage = 4;
    this.type = this.route.snapshot.paramMap.get('type');
    if (this.type) {
      const select = document.getElementById('machine_dropdown') as HTMLSelectElement;
      select.value = this.type;
    }
    this.showReserve = false;
    this.timeSlots = [];
    this.machineData = [];
    this.selectedMachines = [];
    this.allMachines = [];
    this.fromDate = new Date().toISOString().slice(0, 10);
    this.toDate = new Date().toISOString().slice(0, 10);
    this.generateMachineData(this.type);
  }

  private async generateMachineData(type): Promise<any> {
    this.allMachines = await this.machinesService.getMachines();
    this.reservations = await this.machinesService.getReservations();

    _.forEach(this.allMachines, (machine) => {
      machine.reservedTimes = [];
    });

    _.forEach(this.reservations, (reservation) => {
      let thing = _.find(this.allMachines, (m) => m.id === reservation.machine_id);
      thing.reservedTimes.push({date: reservation.date, time: reservation.time});
    });

    this.filterVisibleMachines(type);
  }

  private padToTwo(num): string {
    if (num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  private filterVisibleMachines(type): void {
    let machines = this.allMachines;
    if (!type || type === 'all') {
      machines = this.allMachines;
    } else {
      machines = _.filter(this.allMachines, (machine) => machine.machine_type === type);
    }

    const machineData = [];
    let slots = [];
    for (let j = 5; j < 24; j++) {
      for (let i = 0; i < 6; i++) {
        slots.push(`${this.padToTwo(j)}:${this.padToTwo(i * 10)}`);
      }
    }

    this.timeSlots = slots;
    _.forEach(this.timeSlots, (slot) => {
      machineData.push({time: slot, machines});
    });

    this.machineData = machineData;
  }

  public getTimeSlots() {
    return this.timeSlots;
  }

  public toggleSelection(machine, time) {
      if (_.some(this.selectedMachines, (entry) => entry.machine.id === machine.id && entry.time === time && entry.date === this.fromDate)) {
        _.remove(this.selectedMachines, (entry) => entry.time === time && entry.machine.id === machine.id);
      } else {
        this.selectedMachines.push({machine, time, date: this.fromDate});
      }

      this.showReserve = this.selectedMachines.length && _.every(this.selectedMachines, (selected) => {
        return !_.some(this.reservations, (reservation) => reservation.machine_id === selected.machine.id
        && reservation.time === time && reservation.date === this.fromDate);
      });

      this.showUndoReserve = this.selectedMachines.length && _.every(this.selectedMachines, (selected) => {
        return _.some(this.reservations, (reservation) => reservation.machine_id === selected.machine.id
        && reservation.time === time && reservation.date === this.fromDate);
      });
  }

  public nextPage() {
    this.page++;
  }

  public getChunkedMachines() {
      const startIndex = this.page * this.machinesPerPage;
      return _.slice(_.get(this.machineData[0], 'machines'), startIndex, startIndex + 4);
  }

  public async reserve() {
    // post to DB reservation
    if (this.selectedMachines.length) {
      let invalidReservations = false;

      const selected = this.selectedMachines.slice();
      _.forEach((selected), async (entry) => {
        if (!this.isMachineReservedAtTime(entry.machine, entry.time)) {
          this.toggleSelection(entry.machine, entry.time);
          const reservedMachine = _.find(this.allMachines, (machine) => machine.id === entry.machine.id);
          reservedMachine.reservedTimes.push({date: this.fromDate, time: entry.time});

          await this.machinesService.reserveMachine(entry.machine, entry.time, this.fromDate);
          this.reservationsMade++;
        } else {
          invalidReservations = true;
        }
      });

      if (invalidReservations) {
        alert('Cannot reserve machines that have already been reserved.');
      } else {
        alert('Booking successful for: ' + _.uniq(_.map(this.selectedMachines, (machine) =>
          `${machine.machine_type} ${machine.id} for${machine.time}`)).join('\n')
          + '\nYou can view your reservation in the Routines page!');
      }
    }
  }

  public async undoReserve() {
    const selected = this.selectedMachines.slice();

    if (selected.length) {
      if (_.some((selected), (selectedMachine) => _.includes(_.map(this.reservations, (res) => res.machine_id), selectedMachine.id))) {
       return alert('Cannot undo a reservation for an open machine.');
      } else {
        _.forEach((selected), async (entry) => {
          this.toggleSelection(entry.machine, entry.time);
          entry.machine.reservedTimes = entry.machine.reservedTimes.filter((data) => data.time !== entry.time);
          await this.machinesService.unreserveMachine(entry.machine.id);
        });
        alert('Reservation undone for: ' + _.uniq(_.map(selected, (machine) =>
          `${machine.machine_type} ${machine.id} for${machine.time}`)).join('\n'));
      }
    }
  }

  isMachineReservedAtTime(givenMachine, time) {
    const result =  _.some(givenMachine.reservedTimes, (entry) => entry.time === time);
    return result;
  }

  isMachineSelectedAtTime(machine, time) {
    return _.some(this.selectedMachines, (entry) => {
      return entry.machine.id === machine.id && time === entry.time;
    });
  }

  onSelect() {
    const select = document.getElementById('machine_dropdown') as HTMLSelectElement;
    const type = select.options[select.selectedIndex].value;
    this.filterVisibleMachines(type);
  }

  public lastPage() {
    this.page--;
  }
}
