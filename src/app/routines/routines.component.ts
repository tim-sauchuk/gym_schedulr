import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-routines',
  templateUrl: './routines.component.html',
  styleUrls: ['./routines.component.css']
})
export class RoutinesComponent implements OnInit {
	public _date: string;

  constructor() { }

  ngOnInit() {
    this._date = new Date().toISOString().slice(0, 10);
  }

}
