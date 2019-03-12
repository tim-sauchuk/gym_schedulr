import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  private open: boolean;

  constructor() { }

  ngOnInit() {
    this.open = false;
  }

  public toggleNav() {
    if (!this.open) {
      document.getElementById("mySidebar").style.width = "275px";
      document.getElementById("main").style.marginLeft = "275px";
      this.open = true;
    } else {
      document.getElementById("mySidebar").style.width = "0";
      document.getElementById("main").style.marginLeft = "0";
      this.open = false;
    }
  }
}
