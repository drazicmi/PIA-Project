import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/models/appointment';
import { User } from 'src/app/models/user';
import { DecoratorService } from 'src/app/services/decorator.service';

@Component({
  selector: 'app-decorator-maintenance',
  templateUrl: './decorator-maintenance.component.html',
  styleUrls: ['./decorator-maintenance.component.css']
})
export class DecoratorMaintenanceComponent implements OnInit {

  logged: User = new User();
  maintenences: Appointment[] = [];

  // Local state to store form data
  estimatedCompletionDate: { [key: string]: string } = {}; // Store the estimated completion date
  estimatedCompletionTime: { [key: string]: string } = {}; // Store the estimated completion time
  denialComments: { [key: string]: string } = {}; // Store denial comments for each appointment
  denialForms: { [key: string]: boolean } = {}; // Store visibility of denial form for each appointment

  constructor(private service: DecoratorService) {}

  ngOnInit(): void {
    const tmp = localStorage.getItem('logged');
    if (tmp) {
      this.logged = JSON.parse(tmp);
      this.service.grabAllMaintenenceForDecorator(this.logged.firmName).subscribe((data: Appointment[]) => {
        if (data) {
          this.maintenences = data;
        } else {
          this.maintenences = [];
        }
      });
    }
  }

  // Toggle the denial form visibility for the selected maintenance
  toggleDenialForm(maintenanceId: string) {
    this.denialForms[maintenanceId] = !this.denialForms[maintenanceId];
  }

  // Confirm maintenance with the estimated completion date and time
  confirmMaintenance(maintenance: Appointment) {
    const estimatedDate = this.estimatedCompletionDate[maintenance._id];
    const estimatedTime = this.estimatedCompletionTime[maintenance._id];

    if (estimatedDate && estimatedTime) {

      this.service.confirmMaintenance(maintenance._id, estimatedDate, estimatedTime).subscribe(response => {
        console.log('Maintenance confirmed', response);
      }, error => {
        console.log('Error confirming maintenance:', error);
      });
    } else {
      alert('Please provide both an estimated completion date and time.');
    }
  }

  // Submit the denial with a comment
  submitDenial(maintenance: Appointment) {
    const denialComment = this.denialComments[maintenance._id];
    if (denialComment && denialComment.trim() !== '') {
      this.service.denyMaintenance(maintenance._id, denialComment).subscribe((response: string) => {
        console.log('Maintenance denied', response);
      });
    } else {
      alert('Please provide a reason for the denial.');
    }
  }
}
