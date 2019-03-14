import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-routines',
  templateUrl: './routines.component.html',
  styleUrls: ['./routines.component.css']
})
export class RoutinesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    //casting to input element type
    (<HTMLInputElement> document.getElementById('datePicker')).valueAsDate = new Date();
  }

}
