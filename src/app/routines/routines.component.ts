import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import {MachinesService} from '../machines.service';

@Component({
  selector: 'app-routines',
  templateUrl: './routines.component.html',
  styleUrls: ['./routines.component.css']
})
export class RoutinesComponent implements OnInit {
	public date: string;
  public reservedMachines: any;
  private allReservations: any;

  constructor(private machinesService: MachinesService) { }

  async ngOnInit() {
    this.date = new Date().toISOString().slice(0, 10);
    const allMachines = await this.machinesService.getMachines();
    this.allReservations = await this.machinesService.getReservations();
    this.filterForSelectedDate();

    this.reservedMachines = this.allReservations;
    _.forEach(this.reservedMachines, (machine) => {
        machine.machine_reference = _.find(allMachines, (reg) => reg.id === machine.machine_id);
      });
  }

  private filterForSelectedDate() {
    this.reservedMachines = _.filter(this.allReservations, (reservation) => {
      return (reservation as any).date === this.date;
    });
  }

  async remove(machine) {
    await this.machinesService.unreserveMachine(machine.id)
      .then(() => {
        _.remove(this.reservedMachines, (reservedMachine) => (reservedMachine as any).id === machine.id);
        _.remove(this.allReservations, (reservedMachine) => (reservedMachine as any).id === machine.id);
      });
  }

  onDateChange(obj) {
    this.date = obj.target.value;
    console.log(this.date);
    this.filterForSelectedDate();
  }
}
