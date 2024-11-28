import { Component, OnInit } from '@angular/core';
import { Firms } from 'src/app/models/firms';
import { AdminService } from 'src/app/services/admin.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-unregistered',
  templateUrl: './unregistered.component.html',
  styleUrls: ['./unregistered.component.css']
})
export class UnregisteredComponent implements OnInit {

  constructor(private service: LoginService, private adminService: AdminService) {}

  numberOfDecoratedGardens: number = 0;
  numberOfOwners: number = 0;
  numberOfDecorators: number = 0;
  numberOfSchedualedJobs1: number = 0;
  numberOfSchedualedJobs7: number = 0;
  numberOfSchedualedJobs30: number = 0;
  firms: Firms[] = [];
  filteredFirms: Firms[] = [];  // Filtered firms array for display
  searchName: string = '';      // Bound to the firm name search input
  searchAddress: string = '';   // Bound to the address search input
  sortField: string = '';       // To track which field we're sorting by
  sortAscending: boolean = true;// To track the sort direction

  ngOnInit(): void {
    this.adminService.getAllFirms().subscribe((data: Firms[]) => {
      if (data) {
        this.firms = data;
        this.filteredFirms = [...this.firms];  // Initially, display all firms
        this.adminService.grabDecoratorsCount().subscribe((data: number) => {
          if (data) {
            this.numberOfDecorators = data;
          }
          this.service.grabOwnersCount().subscribe((data: number) => {
            if (data) {
              this.numberOfOwners = data;
            }
            this.service.grabSchedualedGardensCount1().subscribe( (data:number) => {
              if(data) {
                this.numberOfSchedualedJobs1 = data;
              }
              this.service.grabSchedualedGardensCount7().subscribe( (data:number) => {
                if(data) {
                  this.numberOfSchedualedJobs7 = data;
                }
                this.service.grabSchedualedGardensCount30().subscribe( (data:number) => {
                  if(data) {
                    this.numberOfSchedualedJobs30 = data;
                  }
                  this.service.grabDecoratedGardensCount().subscribe ( (data:number) => {
                    if(data) {
                      this.numberOfDecoratedGardens = data;
                    }
                  });
                });
              });
            });
          });
        });
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
}
