import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  constructor(private http: HttpClient) { }



  grabDecoratorsCount ( firmName : string ) {
    let data = {
      firmName : firmName
    }
    return this.http.post<User[]>("http://localhost:4000/owner/grabDecoratorsCount", data);
  }


  createAppointment ( appointmentDetails : {} ) {
    return this.http.post<string>("http://localhost:4000/owner/createAppointment", appointmentDetails);
  }

  getAppointmentsByOwner ( ownerUsername: string ) {
    let data = {
      ownerUsername : ownerUsername
    }
    return this.http.post<Appointment[]>("http://localhost:4000/owner/grabAllAppointments", data);
  }

  grabAllAppointmentsForOwner ( owner_id : string ) {
    let data = {
      owner_id : owner_id
    }
    return this.http.post<Appointment[]>("http://localhost:4000/owner/grabAllAppointmentsForOwner", data);
  }

  scheduleMaintenance ( formData : FormData ) {
    return this.http.post<string>("http://localhost:4000/owner/scheduleMaintenance", formData);
  }

  grabAllMaintenenceForOwner ( owner_id : string ) {
    let data = {
      owner_id : owner_id
    }
    return this.http.post<Appointment[]>("http://localhost:4000/owner/grabAllMaintenenceForOwner", data);
  }

}
