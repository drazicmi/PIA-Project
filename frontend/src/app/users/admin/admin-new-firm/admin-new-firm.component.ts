import { Component, OnInit } from '@angular/core';
import { Firms } from 'src/app/models/firms';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-new-firm',
  templateUrl: './admin-new-firm.component.html',
  styleUrls: ['./admin-new-firm.component.css']
})
export class AdminNewFirmComponent implements OnInit {
  logged: User = new User();  // Store the logged-in user
  decorators: User[] = [];    // Store the list of decorators
  selectedDecorators: string[] = [];  // Store selected decorators
  firm: Firms = new Firms();  // Create an empty Firm object

  // Input fields for services and prices
  serviceInput: string = '';
  servicePriceInput: number | null = null;

  // Inject the AdminService into the constructor
  constructor(private adminService: AdminService) { }

  // OnInit lifecycle hook
  ngOnInit(): void {
    // Fetch the logged-in user from localStorage
    let tmp = localStorage.getItem('logged');
    if (tmp) {
      this.logged = JSON.parse(tmp);
    }

    // Fetch all decorators using the AdminService
    this.adminService.grabAllDecorators().subscribe((data: User[]) => {
      this.decorators = data;
    });
  }

  // Method to add a service and its price to the firm
  addService() {
    if (this.serviceInput.trim() && this.servicePriceInput != null) {
      this.firm.services.push(this.serviceInput.trim());
      this.firm.service_prices.push(this.servicePriceInput);
      console.log(this.firm.service_prices);
      console.log(this.firm.services);
      console.log(this.servicePriceInput);
      this.serviceInput = '';
      this.servicePriceInput = null;
    }
  }

  // Method to remove a service by index
  removeService(index: number) {
    this.firm.services.splice(index, 1);
    this.firm.service_prices.splice(index, 1);
  }

  // Handle form submission
  onSubmit(): void {
    // Ensure at least 2 decorators are selected
    if (this.selectedDecorators.length < 2) {
      alert('Please select at least 2 decorators.');
      return;
    }

    if ( new Date(this.firm.vacation_start) > new Date(this.firm.vacation_end) ) {
      alert("Vacation can't end before it started! Please select correct dates.")
      return;
    }

    // Add selected decorators to the firm
    this.firm.decorator_list = this.selectedDecorators;

    // Ensure all required fields are filled out
    if (!this.firm.name || !this.firm.address || !this.firm.services.length || !this.firm.service_prices.length || !this.firm.longitude || !this.firm.latitude || !this.firm.vacation_start || !this.firm.vacation_end) {
      alert('Please fill out all required fields.');
      return;
    }

    // Create the Firm object
    const newFirm: Firms = {
      name: this.firm.name,
      address: this.firm.address,
      services: this.firm.services,
      service_prices: this.firm.service_prices,
      longitude: this.firm.longitude,
      latitude: this.firm.latitude,
      decorator_list: this.selectedDecorators,
      vacation_start: new Date(this.firm.vacation_start),
      vacation_end: new Date(this.firm.vacation_end),
      contactNumber: this.firm.contactNumber
    };

    this.adminService.addFirm(this.firm).subscribe( (data : string) => {
      if (data) {
        alert("Firm succesfully added!");
        window.location.reload();
      } else {
        alert("Adding the firm failed!");
        window.location.reload();
      }

    });


  }

}
