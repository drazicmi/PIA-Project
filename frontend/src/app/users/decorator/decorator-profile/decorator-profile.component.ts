import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-decorator-profile',
  templateUrl: './decorator-profile.component.html',
  styleUrls: ['./decorator-profile.component.css']
})
export class DecoratorProfileComponent implements OnInit {
  decorator: User = new User();
  updatedDecorator: User = new User(); // Store the form data here
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


  ngOnInit(): void {
    let tmp = localStorage.getItem('logged');
    if (tmp) {
      this.decorator = JSON.parse(tmp);

      this.updatedDecorator = { ...this.decorator }; // Copy data for editing

      // Check if owner has profile picture data
      if (this.decorator.profilePicture && this.decorator.profilePictureType) {
        this.profilePictureUrl = this.createImageUrl(
          this.decorator.profilePicture,
          this.decorator.profilePictureType
        );
      }


      this.service.checkForFinishedAppointments(this.decorator._id).subscribe( (data) => {
          if (data) {
              console.log(data);
          }
      })
    }
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
      this.updatedDecorator.firstname &&
      this.updatedDecorator.firstname !== this.decorator.firstname
    ) {
      this.decorator.firstname = this.updatedDecorator.firstname;
    }
    if (
      this.updatedDecorator.lastname &&
      this.updatedDecorator.lastname !== this.decorator.lastname
    ) {
      this.decorator.lastname = this.updatedDecorator.lastname;
    }
    if (
      this.updatedDecorator.address &&
      this.updatedDecorator.address !== this.decorator.address
    ) {
      this.decorator.address = this.updatedDecorator.address;
    }

    // Email validation
    if (
      this.updatedDecorator.email &&
      this.updatedDecorator.email !== this.decorator.email
    ) {
      if (this.validateEmail(this.updatedDecorator.email)) {
        this.decorator.email = this.updatedDecorator.email;
      } else {
        this.errorMessage = 'Invalid email format';
        return; // Stop submission if the email is invalid
      }
    }

    if (
      this.updatedDecorator.contactPhone &&
      this.updatedDecorator.contactPhone !== this.decorator.contactPhone
    ) {
      this.decorator.contactPhone = this.updatedDecorator.contactPhone;
    }
    if (
      this.updatedDecorator.creditCardNumber &&
      this.updatedDecorator.creditCardNumber !== this.decorator.creditCardNumber
    ) {
      this.decorator.creditCardNumber = this.updatedDecorator.creditCardNumber;
    }

    // Handle the profile picture update if a new file was selected
    if (this.selectedProfilePicture) {
      // Store the profile picture as a File object
      this.updatedDecorator.profilePicture = this.selectedProfilePicture;

      // Optionally store the profile picture type
      this.updatedDecorator.profilePictureType = this.selectedProfilePicture.type;

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
      .grabUserByEmail(this.updatedDecorator.email)
      .subscribe((data: User) => {
        if (data.email != this.updatedDecorator.email && data.email != undefined) {
          this.errorMessage = 'Email is already taken';
          return;
        } else {
          const formData = new FormData();

          // Append fields to FormData object
          formData.append('username', this.decorator.username);
          formData.append('password', this.decorator.password);
          formData.append('type', 'owner');
          formData.append('firstname', this.updatedDecorator.firstname);
          formData.append('lastname', this.updatedDecorator.lastname);
          formData.append('gender', this.updatedDecorator.gender);
          formData.append('address', this.updatedDecorator.address);
          formData.append(
            'phoneNumber',
            this.updatedDecorator.contactPhone.toString()
          );
          formData.append('email', this.updatedDecorator.email);
          formData.append(
            'creditCardNumber',
            this.updatedDecorator.creditCardNumber.toString()
          );
          // Append profile picture if it exists and is a File
          if (this.updatedDecorator.profilePicture instanceof File) {
            formData.append(
              'profilePicture',
              this.updatedDecorator.profilePicture,
              this.updatedDecorator.profilePicture.name
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
