import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-owner-profile',
  templateUrl: './owner-profile.component.html',
  styleUrls: ['./owner-profile.component.css'],
})
export class OwnerProfileComponent implements OnInit {
  owner: User = new User();
  updatedOwner: User = new User(); // Store the form data here
  profilePictureUrl: string = '';
  selectedProfilePicture: File | null = null; // Handle file upload
  profilePicture: File = new File([], 'placeholder');
  profilePictureType: string = '';
  errorMessage: string = '';

  public constructor(
    private service: LoginService,
    private router: Router,
    private http: HttpClient
  ) {}

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

  ngOnInit(): void {
    let tmp = localStorage.getItem('logged');
    if (tmp) {
      this.owner = JSON.parse(tmp);
      this.updatedOwner = { ...this.owner }; // Copy data for editing

      // Check if owner has profile picture data
      if (this.owner.profilePicture && this.owner.profilePictureType) {
        this.profilePictureUrl = this.createImageUrl(
          this.owner.profilePicture,
          this.owner.profilePictureType
        );
      }
    }
  }

  // Validate profile picture dimensions
  validateProfilePictureSize(
    file: File,
    callback: (isValid: boolean) => void
  ): void {
    const img = new Image();
    img.src = window.URL.createObjectURL(file);

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      // Check if the image size is between 100x100 and 300x300 px
      if (width >= 100 && height >= 100 && width <= 300 && height <= 300) {
        callback(true);
      } else {
        callback(false);
      }
    };

    img.onerror = () => {
      this.errorMessage = 'Failed to load image.';
      callback(false);
    };
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      this.selectedProfilePicture = file; // Store the File object

      // Validate profile picture size
      this.validateProfilePictureSize(file, (isValidSize: boolean) => {
        if (!isValidSize) {
          this.errorMessage =
            'Profile picture must be between 100x100 px and 300x300 px in size.';
        } else {
          // Create a preview of the selected image
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.profilePictureUrl = e.target.result; // Preview the image
          };
          reader.readAsDataURL(file); // Only for preview
        }
      });
    } else {
      this.errorMessage = 'Invalid file format. Only PNG and JPEG are allowed.';
    }
  }

  validateEmail(email: string): boolean {
    // Regular expression to validate email address
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Handle form submission
  onSubmit(): void {
    // Only update fields that have new values

    if (
      this.updatedOwner.firstname &&
      this.updatedOwner.firstname !== this.owner.firstname
    ) {
      this.owner.firstname = this.updatedOwner.firstname;
    }
    if (
      this.updatedOwner.lastname &&
      this.updatedOwner.lastname !== this.owner.lastname
    ) {
      this.owner.lastname = this.updatedOwner.lastname;
    }
    if (
      this.updatedOwner.address &&
      this.updatedOwner.address !== this.owner.address
    ) {
      this.owner.address = this.updatedOwner.address;
    }

    // Email validation
    if (
      this.updatedOwner.email &&
      this.updatedOwner.email !== this.owner.email
    ) {
      if (this.validateEmail(this.updatedOwner.email)) {
        this.owner.email = this.updatedOwner.email;
      } else {
        this.errorMessage = 'Invalid email format';
        return; // Stop submission if the email is invalid
      }
    }

    if (
      this.updatedOwner.contactPhone &&
      this.updatedOwner.contactPhone !== this.owner.contactPhone
    ) {
      this.owner.contactPhone = this.updatedOwner.contactPhone;
    }
    if (
      this.updatedOwner.creditCardNumber &&
      this.updatedOwner.creditCardNumber !== this.owner.creditCardNumber
    ) {
      this.owner.creditCardNumber = this.updatedOwner.creditCardNumber;
    }

    // Handle the profile picture update if a new file was selected
    if (this.selectedProfilePicture) {
      // Store the profile picture as a File object
      this.updatedOwner.profilePicture = this.selectedProfilePicture;

      // Optionally store the profile picture type
      this.updatedOwner.profilePictureType = this.selectedProfilePicture.type;

      // If no new profile picture was uploaded, just save the changes
      this.saveChanges();
    } else {
      // If no new profile picture was uploaded, just save the changes
      this.saveChanges();
    }
  }

  // Save changes to localStorage
  saveChanges(): void {
    this.service
      .grabUserByEmail(this.updatedOwner.email)
      .subscribe((data: User) => {
        if (data.email != this.updatedOwner.email && data.email != undefined) {
          this.errorMessage = 'Email is already taken';
          return;
        } else {
          const formData = new FormData();

          // Append fields to FormData object
          formData.append('username', this.owner.username);
          formData.append('password', this.owner.password);
          formData.append('type', 'owner');
          formData.append('firstname', this.updatedOwner.firstname);
          formData.append('lastname', this.updatedOwner.lastname);
          formData.append('gender', this.updatedOwner.gender);
          formData.append('address', this.updatedOwner.address);
          formData.append(
            'contactPhone',
            this.updatedOwner.contactPhone
          );
          formData.append('email', this.updatedOwner.email);
          formData.append(
            'creditCardNumber',
            this.updatedOwner.creditCardNumber.toString()
          );
          // Append profile picture if it exists and is a File
          if (this.updatedOwner.profilePicture instanceof File) {
            formData.append(
              'profilePicture',
              this.updatedOwner.profilePicture,
              this.updatedOwner.profilePicture.name
            );
          }

          // Send the form data to the backend
          this.service.updateUser(formData).subscribe((data: User) => {
            if (data) {
              // Save the updated owner data to localStorage
              localStorage.setItem('logged', JSON.stringify(data));
              alert('Profile updated successfully!');
              this.router.navigate(['/owner/profile']);
            } else {
              alert('Error in registration!');
            }
          });
        }
      });
  }
}
