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
  //correlates to the seeMore pages
  public page: number;
  private machineData: ({ time: boolean; machines: any[] })[];
  private timeSlots: string[];
  private machinesPerPage: number;
  private selectedMachines: any[];
  public from_date: string;
  public to_date: string;
  public reservations_made: number;

  constructor(private route: ActivatedRoute, private machinesService: MachinesService) { }

  ngOnInit() {
    this.page = 0;
    this.machinesPerPage = 4;
    this.type = this.route.snapshot.paramMap.get("type").toString();
    this.timeSlots = [];
    this.machineData = [];
    this.generateMachineData(this.type);
    this.selectedMachines = [];
    this.from_date = new Date().toISOString().slice(0, 10);
    this.to_date = new Date().toISOString().slice(0, 10);
    this.reservations_made = 0;
  }

  private async generateMachineData(type) {
    this.allMachines = await MachinesService.getMachines();
    _.forEach(this.allMachines, (machine) => {
      machine.name = `${machine.machine_type} ${machine.id}`;
      machine.isSelected = false;
    });

    this.filterVisibleMachines(type);
  }

  private async filterVisibleMachines(type): ({ time: boolean; machines: any[] })[] {
    const machines = _.filter(this.allMachines, (machine) => machine.machine_type === type);

    const machineData = [];
    this.timeSlots = _.uniq(_.map(machines, (machine) => machine.time));
    _.forEach(this.timeSlots, (slot) => {
      const machinesForSlot = _.filter(machines, (machine) => (machine.time === slot));
      machineData.push({time: slot, machines: machinesForSlot});
    });

    this.machineData = machineData;
  }

  public getTimeSlots() {
    return this.timeSlots;
  }

  public toggleSelection(machine) {
    let time_conflict = false;
    _.forEach(this.selectedMachines, (sel_machine) => {if (sel_machine.time === machine.time && sel_machine.name !== machine.name) { time_conflict = true;}})

    if (!time_conflict) {
      machine.isSelected = !machine.isSelected;
      if (machine.isSelected) {
        this.selectedMachines.push(machine)
      } else {
        _.remove(this.selectedMachines, (selectedMachine) => selectedMachine.reservationUid === machine.reservationUid);
      }

      const selected = this.selectedMachines.slice();
      const x = document.getElementById("reserve_button");
      if (selected.length) {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
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
    if (this.machineData.length) {
      const startIndex = this.page * this.machinesPerPage;
      return _.slice(_.get(_.find(this.machineData, (data) => data.time === givenTime), 'machines'), startIndex, startIndex + 4);
    }
  }

  public reserve() {
    //post to DB reservation
    const selected = this.selectedMachines.slice();

    if (selected.length) {
      var flag = false;
      const machines = _.flatten(_.map(this.machineData, (data) => data.machines));
      _.forEach((selected), (selectedMachine) => {
        const machine = _.find(machines, (machine) => machine.reservationUid === selectedMachine.reservationUid);
        if(machine.available) {
          this.toggleSelection(machine);
          machine.available = !machine.available;

          this.reservations_made++;
        } else{
          flag = true;
        }
      });
      if (flag) {
        alert("Cannot reserve machines that have already been reserved.")
      } else {
        alert("Booking successful for: " + _.uniq(_.map(selected, (machine) => machine.reservationUid)).join(', ') + "\nYou can view your reservation in the Routines page!");
      }
    }
  }

  public undoReserve() {
    const selected = this.selectedMachines.slice();
    var flag = false;

    if (selected.length) {
      const machines = _.flatten(_.map(this.machineData, (data) => data.machines));
      _.forEach((selected), (selectedMachine) => {
        const machine = _.find(machines, (machine) => machine.reservationUid === selectedMachine.reservationUid);
        if (machine.available) {
          alert("Cannot undo a reservation for an open machine.")
          flag = true;
        } else {
          this.toggleSelection(machine);
          machine.available = !machine.available;
          this.reservations_made -= 1;
        }
      });
      if (!flag){
        alert("Reservation undone for: " + _.uniq(_.map(selected, (machine) => machine.reservationUid)).join(', '));
      }
    }
  }

  public lastPage() {
    this.page--;
  }
}
