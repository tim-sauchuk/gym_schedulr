import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MachinesService {
  private base: string;

  constructor() {
    this.base = 'http://gym-schedulr-api.herokuapp.com';
  }

  getMachines() {
    return fetch(`${this.base}/machines`).then((response) => response.json());
  }

  reserveMachine(machine) {
    return fetch(`${this.base}/machines/${machine.machine_type}/${machine.id}`, {
      method: 'POST',
      body: JSON.stringify({available: false, time: machine.time}),
      headers: {'Content-Type': 'application/json'}
    }).then((response) => response.json());
  }

  unreserveMachine(machine) {
    return fetch(`${this.base}/machines/${machine.machine_type}/${machine.id}`, {
      method: 'POST',
      body: JSON.stringify({available: true, time: machine.time}),
      headers: {'Content-Type': 'application/json'}
    }).then((response) => response.json());
  }

  getReservedMachines() {
    return fetch(`${this.base}/machines?available=false`).then((response) => response.json());
  }
}
