import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import * as _ from 'lodash';

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

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.page = 0;
    this.machinesPerPage = 4;
    this.type = this.route.snapshot.paramMap.get("type");
    this.timeSlots = ['1:00pm', '2:00pm', '3:00pm'];
    this.machineData = this.generateMachineData(this.timeSlots, this.type, 5);
    this.selectedMachines = [];
    this.from_date = new Date().toISOString().slice(0, 10);
    this.to_date = new Date().toISOString().slice(0, 10);
  }

  private generateMachineData(timeSlots, type, num): ({ time: boolean; machines: any[] })[] {
    const machineData = [];
    _.forEach(timeSlots, (slot) => {
      const machines = [];
      for (let i = 0; i < num; i ++) {
        machines.push({name: type + i, isSelected: false, available: true, reservationUid: type + i + slot})
      }
      machineData.push({time: slot, machines: machines})
    });

    return machineData;
  }

  public getTimeSlots() {
    return this.timeSlots;
  }

  public toggleSelection(machine) {
    if (machine.available) {
      machine.isSelected = !machine.isSelected;
      (machine.isSelected) ? this.selectedMachines.push(machine) :
        _.remove(this.selectedMachines, (selectedMachine) => selectedMachine.reservationUid === machine.reservationUid);
    }
  }

  public nextPage() {
    this.page++;
  }

  public getChunkedMachines() {
    const startIndex = this.page * this.machinesPerPage;
    return _.get(this.machineData[0], 'machines').slice(startIndex, startIndex + 4);
  }

  public getMachinesByTime(givenTime) {
    const startIndex = this.page * this.machinesPerPage;
    return _.get(_.find(this.machineData, (data) => data.time === givenTime), 'machines').slice(startIndex, startIndex + 4);
  }

  public reserve() {
    //post to DB reservation
    const selected = this.selectedMachines.slice();

    if (selected.length) {
      const machines = _.flatten(_.map(this.machineData, (data) => data.machines));
      _.forEach((selected), (selectedMachine) => {
        const machine = _.find(machines, (machine) => machine.reservationUid === selectedMachine.reservationUid);
        this.toggleSelection(machine);
        machine.available = false;
      });


      alert("Booking successful for: " + _.uniq(_.map(selected, (machine) => machine.name)).join(', '));
    }
  }

  public lastPage() {
    this.page--;
  }
}
