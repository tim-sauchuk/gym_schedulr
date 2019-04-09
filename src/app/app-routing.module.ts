import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PolicyComponent} from "./policy/policy.component";
import {ReservationsComponent} from "./reservations/reservations.component";
import {RoutinesComponent} from "./routines/routines.component";
import {AvailabilityComponent} from "./availability/availability.component";
import {HomeComponent} from "./home/home.component";
import {MapComponent} from "./map/map.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'reservations/:type',
    component: ReservationsComponent
  },
  {
    path: 'reservations',
    component: ReservationsComponent
  },
  {
    path: 'routines',
    component: RoutinesComponent
  },
  {
    path: 'availability',
    component: AvailabilityComponent
  },
  {
    path: 'policy',
    component: PolicyComponent
  },
  {
    path: 'map',
    component: MapComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
