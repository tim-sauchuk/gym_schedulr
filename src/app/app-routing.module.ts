import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReservationsComponent} from "./reservations/reservations.component";
import {RoutinesComponent} from "./routines/routines.component";
import {AvailabilityComponent} from "./availability/availability.component";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'reservations',
    component: ReservationsComponent,
  },
  {
    path: 'routines',
    component: RoutinesComponent
  },
  {
    path: 'availability',
    component: AvailabilityComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
