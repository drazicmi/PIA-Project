import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/models/appointment';
import { User } from 'src/app/models/user';
import { OwnerService } from 'src/app/services/owner.service';

@Component({
  selector: 'app-owner-maintenance',
  templateUrl: './owner-maintenance.component.html',
  styleUrls: ['./owner-maintenance.component.css']
})
export class OwnerMaintenanceComponent implements OnInit {

  owner: User = new User();
  appointments: Appointment[] = [];
  maintenances : Appointment[] = [];

  constructor(private service: OwnerService) {}

  ngOnInit(): void {
    const loggedOwner = localStorage.getItem('logged');
    if (loggedOwner) {
      this.owner = JSON.parse(loggedOwner);
    }

    this.service.grabAllAppointmentsForOwner(this.owner._id).subscribe((data: Appointment[]) => {
      if (data) {
        this.appointments = data;
        this.service.grabAllMaintenenceForOwner(this.owner._id).subscribe( (data : Appointment[]) => {
            if(data) {
              this.maintenances = data;
            } else {
              this.maintenances = []
            }
        })
      } else {
        this.appointments = [];
      }
    });
  }

  // Check if the appointment is older than 6 months
  isOlderThanSixMonths(appointmentDate: Date): boolean {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return new Date(appointmentDate) < sixMonthsAgo;
  }

  // Method to schedule the maintenance for a selected appointment
  scheduleMaintenance(appointment: Appointment) {


    const formData = new FormData();
    formData.append('_id', appointment._id);
    formData.append('schedulingDate', new Date(appointment.schedulingDate).toISOString());
    formData.append('date', new Date(appointment.date).toISOString());
    formData.append('time', appointment.time);
    formData.append('squareFootage', appointment.squareFootage.toString());
    formData.append('gardenType', appointment.gardenType);
    formData.append('services', JSON.stringify(appointment.services));
    formData.append('additionalDescription', appointment.additionalDescription || '');

    formData.append('firm', JSON.stringify(appointment.firm));
    formData.append('owner', JSON.stringify(appointment.owner));

    formData.append('totalSquareFootage', appointment.squareFootage.toString());
    formData.append('poolSquareFootage', appointment.poolSquareFootage ? appointment.poolSquareFootage.toString() : '0');
    formData.append('greenerySquareFootage', appointment.greenerySquareFootage ? appointment.greenerySquareFootage.toString() : '0');
    formData.append('sunbedsSquareFootage', appointment.sunbedsSquareFootage ? appointment.sunbedsSquareFootage.toString() : '0');
    formData.append('fountainSquareFootage', appointment.fountainSquareFootage ? appointment.fountainSquareFootage.toString() : '0');
    formData.append('tableCount', appointment.tableCount ? appointment.tableCount.toString() : '0');
    formData.append('chairCount', appointment.chairCount ? appointment.chairCount.toString() : '0');
    formData.append('gardenLayout', JSON.stringify(appointment.gardenLayout));

    this.service.scheduleMaintenance(formData).subscribe( (data : string )=> {
        if (data) {
          alert(`Scheduling maintenance for appointment ID: ${appointment._id}`)
        }
        else {
          alert(`Failed to schedual maintenance for appointment ID: ${appointment._id}`)
        }
    })

  }


}
