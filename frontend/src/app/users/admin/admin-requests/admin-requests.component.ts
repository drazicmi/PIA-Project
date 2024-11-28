import { Component, OnInit } from '@angular/core';
import { Requests } from 'src/app/models/requests';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-requests',
  templateUrl: './admin-requests.component.html',
  styleUrls: ['./admin-requests.component.css']
})
export class AdminRequestsComponent implements OnInit {

  logged: User = new User();
  requests: Requests[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    // Fetch logged-in user from localStorage
    let tmp = localStorage.getItem('logged');
    if (tmp) {
      this.logged = JSON.parse(tmp);
    }

    // Fetch all requests from the server
    this.adminService.grabAllRequests().subscribe((data: Requests[]) => {
      if (data) {
        this.requests = data;
      }
    });
  }

  // Method to approve a request (passing the entire request object)
  approveRequest(request: Requests): void {
    if (confirm(`Are you sure you want to approve this request?`)) {
      this.adminService.approveRequest(request).subscribe(() => {
      });
    }
  }

  // Method to reject a request (passing the entire request object)
  rejectRequest(request: Requests): void {
    if (confirm(`Are you sure you want to reject this request?`)) {
      this.adminService.rejectRequest(request).subscribe(() => {
      });
    }
  }
}
