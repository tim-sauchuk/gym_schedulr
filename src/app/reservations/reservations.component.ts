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
  private showReserve: boolean;
  private showUndoReserve: boolean;

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
    let numOfReservations = 0;
    _.forEach(this.allMachines, (machine) => {
      if (!machine.available) {
        numOfReservations++;
      }
      machine.name = `${machine.machine_type} ${machine.id}`;
      machine.isSelected = false;
    });

    this.reservationsMade = numOfReservations;
    this.filterVisibleMachines(type);
  }

  private filterVisibleMachines(type): void {
    let machines;
    if (!type || type === 'all') {
      machines = this.allMachines;
    } else {
      machines = _.filter(this.allMachines, (machine) => machine.machine_type === type);
    }

    const machineData = [];
    this.timeSlots = _.uniq(_.map(machines, (machine) => machine.time));
    _.forEach(this.timeSlots, (slot) => {
      const machinesForSlot = _.filter(machines, (machine) => (machine.time === slot));
      machineData.push({time: slot, machines: _.sortBy(machinesForSlot, (machine) => machine.id + machine.machine_type)});
    });

    this.machineData = machineData;
  }

  public getTimeSlots() {
    return this.timeSlots;
  }

  public toggleSelection(machine) {
    let timeConflict = false;
    _.forEach(this.selectedMachines, (selMachine) => {
      if (selMachine.time === machine.time && selMachine.machine_type !== machine.machine_type) {
        timeConflict = true;
      }});

    if (!timeConflict) {
      machine.isSelected = !machine.isSelected;

      if (machine.isSelected) {
        this.selectedMachines.push(machine);
      } else {
        _.remove(this.selectedMachines, (selectedMachine) => selectedMachine.time === machine.time &&
          selectedMachine.machine_type === machine.machine_type && selectedMachine.id === machine.id);
      }

      const selected = this.selectedMachines.slice();
      this.showReserve = selected.length && _.some(this.selectedMachines, (sM) => sM.available);
      this.showUndoReserve = selected.length && _.some(this.selectedMachines, (sM) => !sM.available);
    }
  }

  public nextPage() {
    this.page++;
  }

  public getChunkedMachines() {
      const startIndex = this.page * this.machinesPerPage;
      return _.slice(_.get(this.machineData[0], 'machines'), startIndex, startIndex + 4);
  }

  public getMachinesByTime(givenTime) {
      const startIndex = this.page * this.machinesPerPage;
      return _.slice(_.get(_.find(this.machineData, (data) => data.time === givenTime), 'machines'), startIndex, startIndex + 4);
  }

  public async reserve() {
    // post to DB reservation
    const selected = this.selectedMachines.slice();

    if (selected.length) {
      let invalidReservations = false;
      const machines = _.flatten(_.map(this.machineData, (data) => data.machines));

      _.forEach((selected), async (selectedMachine) => {
        const machine = _.find(machines, (target) => target.machine_type === selectedMachine.machine_type &&
          target.time === selectedMachine.time && target.id === selectedMachine.id);
        if (machine.available) {
          this.toggleSelection(machine);
          machine.available = !machine.available;

          await this.machinesService.reserveMachine(machine);
          this.reservationsMade++;
        } else {
          invalidReservations = true;
        }
      });

      if (invalidReservations) {
        alert('Cannot reserve machines that have already been reserved.');
      } else {
        alert('Booking successful for: ' + _.uniq(_.map(selected, (machine) =>
          `${machine.machine_type} ${machine.id} for${machine.time}`)).join('\n')
          + '\nYou can view your reservation in the Routines page!');
      }
    }
  }

  public async undoReserve() {
    const selected = this.selectedMachines.slice();

    if (selected.length) {
      if (_.some((selected), (selectedMachine) => (selectedMachine.available))) {
       return alert('Cannot undo a reservation for an open machine.');
      } else {
        _.forEach((selected), async (machine) => {
          this.toggleSelection(machine);
          machine.available = !machine.available;

          await this.machinesService.unreserveMachine(machine);
        });
        alert('Reservation undone for: ' + _.uniq(_.map(selected, (machine) =>
          `${machine.machine_type} ${machine.id} for${machine.time}`)).join('\n'));
      }
    }
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
