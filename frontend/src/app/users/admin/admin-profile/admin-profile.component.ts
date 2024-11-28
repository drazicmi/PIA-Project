import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firms } from 'src/app/models/firms';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {

  ownersList: User[] = [];
  decoratorsList: User[] = [];
  firmsList: Firms[] = [];

  selectedOwner: User | null = null;
  selectedDecorator: User | null = null;

  updatedOwner: any = {};
  updatedDecorator: any = {};

  selectedProfilePicture: File | null = null;

  constructor(private service: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.service.grabAllDecoratorsAdminProfile().subscribe((data) => {
      if (data) {
        this.decoratorsList = data;
      }
      this.service.grabAllOwnersAdminProfile().subscribe((data) => {
        if (data) {
          this.ownersList = data;
        }
        this.service.grabAllFirmsAdminProfile().subscribe((data) => {
          if (data) {
            this.firmsList = data;
          }
        });
      });
    });
  }

  // Convert Buffer to base64 and create a data URL
  createImageUrl(buffer: any, contentType: string): string {
    if (buffer && buffer.data) {
      const base64String = btoa(
        buffer.data.reduce(
          (data: string, byte: number) => data + String.fromCharCode(byte),
          ''
        )
      );
      return `data:${contentType};base64,${base64String}`;
    }
    return '';
  }

  // Select an owner to update
  selectOwnerForUpdate(owner: User): void {
    this.selectedOwner = owner;
    this.updatedOwner = { ...owner }; // Clone the object to allow editing
  }

  // Select a decorator to update
  selectDecoratorForUpdate(decorator: User): void {
    this.selectedDecorator = decorator;
    this.updatedDecorator = { ...decorator };
  }

  // Handle profile picture selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      this.selectedProfilePicture = file;
    } else {
      alert('Invalid file format. Only PNG and JPEG are allowed.');
    }
  }

  profilePictureUrl : string = '';

  // Update Owner
  onSubmitOwner(): void {
    // Check if owner has profile picture data
    if (this.updatedOwner.profilePicture && this.updatedOwner.profilePictureType) {
      this.profilePictureUrl = this.createImageUrl(
        this.updatedOwner.profilePicture,
        this.updatedOwner.profilePictureType
      );
    }
    const formData = new FormData();
    // Append fields to FormData object
    formData.append('username', this.updatedOwner.username);
    formData.append('password', this.updatedOwner.password);
    formData.append('type', 'owner');
    formData.append('firstname', this.updatedOwner.firstname);
    formData.append('lastname', this.updatedOwner.lastname);
    formData.append('gender', this.updatedOwner.gender);
    formData.append('address', this.updatedOwner.address);
    formData.append(
      'phoneNumber',
      this.updatedOwner.contactPhone.toString()
    );
    formData.append('email', this.updatedOwner.email);
    formData.append(
      'creditCardNumber',
      this.updatedOwner.creditCardNumber.toString()
    );
    if (this.selectedProfilePicture) {
      // Store the profile picture as a File object
      this.updatedOwner.profilePicture = this.selectedProfilePicture;

      // Optionally store the profile picture type
      this.updatedOwner.profilePictureType = this.selectedProfilePicture.type;
    }
    // Append profile picture if it exists and is a File
    if (this.updatedOwner.profilePicture instanceof File) {
      formData.append(
        'profilePicture',
        this.updatedOwner.profilePicture,
        this.updatedOwner.profilePicture.name
      );
    }
    this.service.updateUser(formData).subscribe((data : User) => {
      if(data) {
        alert('Owner updated successfully!');
        this.cancelUpdate();
        this.router.navigate(['/admin/profile']);
      }
    });
  }

  // Update Decorator
  onSubmitDecorator(): void {
    // Check if owner has profile picture data
    if (this.updatedOwner.profilePicture && this.updatedOwner.profilePictureType) {
      this.profilePictureUrl = this.createImageUrl(
        this.updatedOwner.profilePicture,
        this.updatedOwner.profilePictureType
      );
    }
    const formData = new FormData();
    // Append fields to FormData object
    formData.append('username', this.updatedDecorator.username);
    formData.append('password', this.updatedDecorator.password);
    formData.append('type', 'owner');
    formData.append('firstname', this.updatedDecorator.firstname);
    formData.append('lastname', this.updatedDecorator.lastname);
    formData.append('gender', this.updatedDecorator.gender);
    formData.append('address', this.updatedDecorator.address);
    formData.append('firmName', this.updatedDecorator.firmName);
    formData.append(
      'phoneNumber',
      this.updatedDecorator.contactPhone.toString()
    );
    formData.append('email', this.updatedDecorator.email);
    formData.append(
      'creditCardNumber',
      this.updatedDecorator.creditCardNumber.toString()
    );
    if (this.selectedProfilePicture) {
      // Store the profile picture as a File object
      this.updatedDecorator.profilePicture = this.selectedProfilePicture;

      // Optionally store the profile picture type
      this.updatedDecorator.profilePictureType = this.selectedProfilePicture.type;
    }
    // Append profile picture if it exists and is a File
    if (this.updatedDecorator.profilePicture instanceof File) {
      formData.append(
        'profilePicture',
        this.updatedDecorator.profilePicture,
        this.updatedDecorator.profilePicture.name
      );
    }
    this.service.updateUser(formData).subscribe((data : User) => {
      if(data) {
        alert('Decorator updated successfully!');
        this.cancelUpdate();
        this.router.navigate(['/admin/profile']);
      }
    });
  }

  cancelUpdate(): void {
    this.selectedOwner = null;
    this.selectedDecorator = null;
    this.updatedOwner = {};
    this.updatedDecorator = {};
  }
}
