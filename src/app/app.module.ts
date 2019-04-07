import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {PolicyComponent} from "./policy/policy.component";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { RoutinesComponent } from './routines/routines.component';
import { AvailabilityComponent } from './availability/availability.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({
  declarations: [
    AppComponent,
    ReservationsComponent,
    RoutinesComponent,
    AvailabilityComponent,
    HomeComponent,
    SidebarComponent,
    PolicyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
