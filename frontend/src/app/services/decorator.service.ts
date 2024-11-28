import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Appointment } from '../models/appointment';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DecoratorService {

  constructor(private http: HttpClient) { }


  grabAllAppointmentsForDecorator ( firmName : string) {
    let data = { firmName : firmName }
    return this.http.post<Appointment[]>("http://localhost:4000/decorator/grabAllAppointmentsForDecorator", data);
  }

  confirmAppointment ( appointment_id : string, decorator_id : string ) {
    let data = {
      appointment_id : appointment_id,
      decorator_id : decorator_id
    }

    return this.http.post<Appointment[]>("http://localhost:4000/decorator/confirmAppointment", data);
  }

  rejectAppointment ( appointment_id : string, rejectionComment : string ) {
    let data = {
      appointment_id : appointment_id,
      rejectionComment: rejectionComment
    }

    return this.http.post<Appointment[]>("http://localhost:4000/decorator/rejectAppointment", data);
  }

  grabAllMaintenenceForDecorator( firmName : string) {
    let data = { firmName : firmName }
    return this.http.post<Appointment[]>("http://localhost:4000/decorator/grabAllMaintenenceForDecorator", data);
  }


  confirmMaintenance(appointmentId: string, date: string, time:string) {
    let data = {
      appointmentId: appointmentId,
      date: new Date(date).toISOString(),
      time: time
    }
    return this.http.post<string>("http://localhost:4000/decorator/confirmMaintenance", data);
  }

  denyMaintenance(appointmentId: string, denialComment: string) {
    let data = {
      appointmentId: appointmentId,
      denialComment: denialComment
    }
    return this.http.post<string>("http://localhost:4000/decorator/denyMaintenance", data);
  }

  getJobsPerMonth(decoratorID: string): Observable<{ months: string[], jobsCount: number[] }> {
    let data = {
      decoratorID : decoratorID
    }
    return this.http.post<{ months: string[], jobsCount: number[] }>("http://localhost:4000/decorator/getJobsPerMonth", data);
  }


  getJobDistributionForFirm(firmName: string): Observable<{ decoratorNames: string[], jobCounts: number[] }> {
    const data = {
      firmName: firmName
    };
    return this.http.post<{ decoratorNames: string[], jobCounts: number[] }>(`http://localhost:4000/decorator/getJobDistributionForFirm`, data);
  }


  getAverageJobsPerDay(decoratorID: string): Observable<{ dayOfWeek: number, averageJobCount: number }[]> {
    const data = {
      decoratorID: decoratorID
    };

    return this.http.post<{ dayOfWeek: number, averageJobCount: number }[]>("http://localhost:4000/decorator/getAverageJobsPerDay", data);
  }





}
