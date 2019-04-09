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
    const allMachines = await this.machinesService.getMachines();
    this.machinesService.getReservations()
      .then((response) => {
        this.reservedMachines = response;
        _.forEach(this.reservedMachines, (machine) => {
          machine.machine_reference = _.find(allMachines, (reg) => reg.id === machine.machine_id);
        });
      });
  }

  async remove(machine) {
    await this.machinesService.unreserveMachine(machine.id)
      .then(() => _.remove(this.reservedMachines, (reservedMachine) => reservedMachine === machine));
  }
}
