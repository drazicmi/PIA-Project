import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/models/appointment';  // Assuming Appointment model is defined
import { OwnerService } from 'src/app/services/owner.service';  // Service to fetch appointments
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-owner-make-appointment',
  templateUrl: './owner-make-appointment.component.html',
  styleUrls: ['./owner-make-appointment.component.css']
})
export class OwnerMakeAppointmentComponent implements OnInit {
  appointments: Appointment[] = [];
  owner: User = new User();

  constructor(private ownerService: OwnerService) {}

  ngOnInit(): void {
    const ownerData = localStorage.getItem('logged');
    if (ownerData) {
      this.owner = JSON.parse(ownerData);
    }

    this.ownerService.getAppointmentsByOwner(this.owner.username).subscribe(
      (data: Appointment[]) => {
        if (data) {
          this.appointments = data;
        }
      }
    );
  }
}
