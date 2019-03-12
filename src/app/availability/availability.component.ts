import { Component, OnInit } from '@angular/core';
declare let google: any;

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    google.charts.setOnLoadCallback(this.drawChart);
  }

  drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Time', 'Percentage of Machines in Use'],
      ['5AM',  20],
      ['6AM',  30],
      ['7AM',  60],
      ['8AM',  60],
      ['9AM',  45],
      ['10AM', 45],
      ['11AM', 40],
      ['12PM', 30],
      ['1PM', 35],
      ['2PM', 45],
      ['3PM', 50],
      ['4PM', 55],
      ['5PM', 55],
      ['6PM', 70],
      ['7PM', 100],
      ['8PM', 80],
      ['9PM', 70],
      ['10PM', 55],
      ['11PM', 40],
      ['12AM', 25],
      ['1AM', 10]
    ]);

    var view = new google.visualization.DataView(data);
    document.getElementById('machine_type').onclick=function() {
      var data = google.visualization.arrayToDataTable([
        ['Time', 'Percentage of Machines in Use'],
        ['5AM',  20],
        ['6AM',  100],
        ['7AM',  60],
        ['8AM',  60],
        ['9AM',  45],
        ['10AM', 45],
        ['11AM', 40],
        ['12PM', 30],
        ['1PM', 35],
        ['2PM', 25],
        ['3PM', 50],
        ['4PM', 55],
        ['5PM', 0],
        ['6PM', 70],
        ['7PM', 90],
        ['8PM', 80],
        ['9PM', 70],
        ['10PM', 55],
        ['11PM', 40],
        ['12AM', 25],
        ['1AM', 10]
      ]);
      var options = {
        title: '',
        bar: {groupWidth: "97%"},
        legend: { position: "none" },
      };
      var view = new google.visualization.DataView(data);
      chart.draw(view, options);
    }
    var options = {
      title: 'Percentage of Machines in Use',
      bar: {groupWidth: "97%"},
      legend: { position: "none" },
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('container'));
    chart.draw(view, options);
  }
}
