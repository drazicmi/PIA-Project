import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/models/appointment';
import { User } from 'src/app/models/user';
import { DecoratorService } from 'src/app/services/decorator.service';

@Component({
  selector: 'app-decorator-make-appointment',
  templateUrl: './decorator-make-appointment.component.html',
  styleUrls: ['./decorator-make-appointment.component.css']
})
export class DecoratorMakeAppointmentComponent implements OnInit {

  appointments: Appointment[] = [];
  decorator: User = new User();
  selectedAppointment: Appointment | null = null;
  rejectionComment: string = '';

  constructor(private service: DecoratorService) {}

  ngOnInit(): void {
    const loggedDecorator = localStorage.getItem('logged');
    if (loggedDecorator) {
      this.decorator = JSON.parse(loggedDecorator);
    }


    this.service.grabAllAppointmentsForDecorator(this.decorator.firmName).subscribe((data: Appointment[]) => {
      if (data) {
        this.appointments = data.sort((a, b) => new Date(b.schedulingDate).getTime() - new Date(a.schedulingDate).getTime());
      } else {
        this.appointments = [];
      }
    });
  }


  confirmAppointment(appointment: Appointment) {

    this.service.confirmAppointment(appointment._id, this.decorator._id).subscribe((response) => {
      this.appointments = this.appointments.filter(a => a._id !== appointment._id);
    }, (error) => {
      console.error('Error confirming appointment:', error);
    });
  }


  rejectAppointment(appointment: Appointment) {
    if (!this.rejectionComment) {
      alert('You must provide a comment to reject the appointment.');
      return;
    }

    this.service.rejectAppointment(appointment._id, this.rejectionComment).subscribe( (response) => {
      this.appointments = this.appointments.filter(a => a._id !== appointment._id);
      this.selectedAppointment = null;
      this.rejectionComment = '';
    }, (error) => {
      console.error('Error rejecting appointment:', error);
    });
  }

  selectAppointmentForRejection(appointment: Appointment) {
    this.selectedAppointment = appointment;
  }

  cancelRejection() {
    this.selectedAppointment = null;
    this.rejectionComment = '';
  }
}
