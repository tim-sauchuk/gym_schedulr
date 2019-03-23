import { Component, OnInit } from '@angular/core';
import * as _ from "lodash";

@Component({
  selector: 'app-routines',
  templateUrl: './routines.component.html',
  styleUrls: ['./routines.component.css']
})
export class RoutinesComponent implements OnInit {
	public _date: string;
  public reservedMachines: any[];

  constructor() { }

  ngOnInit() {
    this._date = new Date().toISOString().slice(0, 10);
    this.reservedMachines = [
      {name: "Tread1", time: "7:30-8:30 AM"},
      {name: "Squat3", time: "8:00-8:10 AM"},
      {name: "Elliptical6", time:"8:10-8:30 AM"}
    ];
  }

  remove(machine) {
    _.remove(this.reservedMachines, (reservedMachine) => reservedMachine === machine);
  }
}
