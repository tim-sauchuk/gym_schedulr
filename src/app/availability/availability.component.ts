import { Component, OnInit } from '@angular/core';
declare let google: any;

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent implements OnInit {

  constructor() {

  }


  ngOnInit() {
    google.charts.setOnLoadCallback(this.drawChart);
  }

  drawChart() {
    var d = document.getElementById("machine_dropdown") as HTMLSelectElement;
    var machineType = d.options[d.selectedIndex].text;

    if (machineType == 'All Machines') {
      var data = google.visualization.arrayToDataTable([
        ['Time', 'Percentage of ' + machineType + ' in Use'],
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
    }
    else if (machineType == 'Treadmills') {
      var data = google.visualization.arrayToDataTable([
        ['Time', 'Percentage of ' + machineType + ' in Use'],
        ['5AM',  30],
        ['6AM',  90],
        ['7AM',  80],
        ['8AM',  60],
        ['9AM',  50],
        ['10AM', 50],
        ['11AM', 40],
        ['12PM', 30],
        ['1PM', 35],
        ['2PM', 45],
        ['3PM', 50],
        ['4PM', 55],
        ['5PM', 55],
        ['6PM', 70],
        ['7PM', 90],
        ['8PM', 100],
        ['9PM', 100],
        ['10PM', 55],
        ['11PM', 40],
        ['12AM', 25],
        ['1AM', 40]
      ]);
    }
    else if (machineType == 'Squat Racks') {
      var data = google.visualization.arrayToDataTable([
        ['Time', 'Percentage of ' + machineType + ' in Use'],
        ['5AM',  0],
        ['6AM',  10],
        ['7AM',  40],
        ['8AM',  40],
        ['9AM',  30],
        ['10AM', 40],
        ['11AM', 40],
        ['12PM', 30],
        ['1PM', 60],
        ['2PM', 60],
        ['3PM', 70],
        ['4PM', 70],
        ['5PM', 55],
        ['6PM', 75],
        ['7PM', 100],
        ['8PM', 100],
        ['9PM', 100],
        ['10PM', 70],
        ['11PM', 40],
        ['12AM', 25],
        ['1AM', 20]
      ]);
    }
    else if (machineType == 'Stairmasters') {
      var data = google.visualization.arrayToDataTable([
        ['Time', 'Percentage of ' + machineType + ' in Use'],
        ['5AM',  20],
        ['6AM',  50],
        ['7AM',  70],
        ['8AM',  70],
        ['9AM',  50],
        ['10AM', 45],
        ['11AM', 40],
        ['12PM', 30],
        ['1PM', 50],
        ['2PM', 60],
        ['3PM', 60],
        ['4PM', 55],
        ['5PM', 55],
        ['6PM', 70],
        ['7PM', 100],
        ['8PM', 90],
        ['9PM', 100],
        ['10PM', 55],
        ['11PM', 40],
        ['12AM', 35],
        ['1AM', 30]
      ]);
    }

    var view = new google.visualization.DataView(data);

    var options = {
      title: 'Percentage of ' + machineType + ' in Use',
      bar: {groupWidth: "97%"},
      legend: { position: "none" },
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('container'));
    chart.draw(view, options);
  }
}
