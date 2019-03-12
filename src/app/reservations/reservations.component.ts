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
  private machineData: ({ time: string; machines: string[] })[];
  private timeSlots: string[];
  private machinesPerPage: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.page = 0;
    this.machinesPerPage = 4;
    this.type = this.route.snapshot.paramMap.get("type");
    this.timeSlots = ['1:00pm', '2:00pm', '3:00pm'];
    this.machineData = [
      {time: this.timeSlots[0], machines: ['Tread1', 'Tread2', 'Tread3', 'Tread4']},
      {time: this.timeSlots[1], machines: ['Tread1', 'Tread2', 'Tread3', 'Tread4', 'Tread5']},
      {time: this.timeSlots[2], machines: ['Tread1', 'Tread2', 'Tread3', 'Tread4']}
    ]
  }

  public getTimeSlots() {
    return this.timeSlots;
  }

  public nextPage() {
    this.page++;
  }

  public getMachinesByTime(givenTime) {
    const startIndex = this.page * this.machinesPerPage;
    return _.get(_.find(this.machineData, (data) => data.time === givenTime), 'machines').slice(startIndex, startIndex + 4);
  }

  public reserve(name, time) {
    alert("Booking successful for " + name + " at " + time);
  }

  public lastPage() {
    this.page--;
  }
}
