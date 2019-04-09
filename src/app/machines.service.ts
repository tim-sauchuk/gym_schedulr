import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MachinesService {
  private base: string;

  constructor() {
    this.base = 'http://localhost:3000';
  }

  getMachines() {
    return fetch(`${this.base}/machines`).then((response) => response.json());
  }

  reserveMachine(machine, time, date) {
    return fetch(`${this.base}/reservations`, {
      method: 'POST',
      body: JSON.stringify({machine_id: machine.id, time, date}),
      headers: {'Content-Type': 'application/json'}
    }).then((response) => response.json());
  }

  unreserveMachine(id) {
    return fetch(`${this.base}/reservations/${id}`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    }).then((response) => response.json());
  }

  getReservations() {
    return fetch(`${this.base}/reservations`).then((response) => response.json());
  }
}
