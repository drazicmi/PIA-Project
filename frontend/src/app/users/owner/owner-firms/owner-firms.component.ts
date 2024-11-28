import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firms } from 'src/app/models/firms';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-owner-firms',
  templateUrl: './owner-firms.component.html',
  styleUrls: ['./owner-firms.component.css']
})
export class OwnerFirmsComponent implements OnInit {
  firms: Firms[] = [];
  filteredFirms: Firms[] = [];  // Filtered firms array for display
  searchName: string = '';      // Bound to the firm name search input
  searchAddress: string = '';   // Bound to the address search input
  sortField: string = '';       // To track which field we're sorting by
  sortAscending: boolean = true;// To track the sort direction

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.adminService.getAllFirms().subscribe((data: Firms[]) => {
      if (data) {
        this.firms = data;
        this.filteredFirms = [...this.firms];  // Initially, display all firms
      }
    });
  }

  // Method to search firms based on name and address
  searchFirms() {
    this.filteredFirms = this.firms.filter(firm => {
      const matchesName = firm.name.toLowerCase().includes(this.searchName.toLowerCase());
      const matchesAddress = firm.address.toLowerCase().includes(this.searchAddress.toLowerCase());
      return (this.searchName === '' || matchesName) && (this.searchAddress === '' || matchesAddress);
    });
  }

  // Method to clear the search filters and reset the firms list
  clearSearch() {
    this.searchName = '';
    this.searchAddress = '';
    this.filteredFirms = [...this.firms];  // Reset to all firms
  }

  // Method to sort firms by name or address
  sortBy(field: 'name' | 'address'): void {
    if (this.sortField === field) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortField = field;
      this.sortAscending = true;
    }

    this.filteredFirms.sort((a, b) => {
      const valueA = a[field].toLowerCase();
      const valueB = b[field].toLowerCase();
      if (valueA < valueB) return this.sortAscending ? -1 : 1;
      if (valueA > valueB) return this.sortAscending ? 1 : -1;
      return 0;
    });
  }

  // Method to handle clicking on a firm name
  onFirmClick(firm: Firms) {
    localStorage.setItem('selectedFirm', JSON.stringify(firm));  // Save the firm to localStorage
    this.router.navigate(['owner/firm-details']);  // Navigate to the firm details page
  }
}
