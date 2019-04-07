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

  constructor(private machinesService: MachinesService) { }

  async ngOnInit() {
    this.date = new Date().toISOString().slice(0, 10);
    this.machinesService.getReservedMachines()
      .then((response) => this.reservedMachines = response);
  }

  async remove(machine) {
    await this.machinesService.unreserveMachine(machine)
      .then(() =>_.remove(this.reservedMachines, (reservedMachine) => reservedMachine === machine));
  }
}
