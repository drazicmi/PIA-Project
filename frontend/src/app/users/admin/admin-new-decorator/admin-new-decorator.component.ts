import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firms } from 'src/app/models/firms';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-admin-new-decorator',
  templateUrl: './admin-new-decorator.component.html',
  styleUrls: ['./admin-new-decorator.component.css']
})
export class AdminNewDecoratorComponent implements OnInit {
  public constructor(private service: LoginService, private serviceAdmin : AdminService, private router: Router, private http: HttpClient) {}

  username: string = '';
  password: string = '';
  type: string = '';
  firstname: string = '';
  lastname: string = '';
  gender: string = '';
  address: string = '';
  phoneNumber: number = 0;
  email: string = '';
  creditCardNumber : Number = 0;
  profilePicture: File = new File([], "placeholder");
  errorMessage: string = '';
  firms : Firms[] = [];
  selectedFirm : string = '';


  defaultImageUrl: string = '../../../assets/default.jpg';

  ngOnInit() {
    this.setDefaultProfilePicture();
    this.serviceAdmin.getAllFirms().subscribe( (data) => {
      if (data)  {
        this.firms = data;
        if (this.firms.length > 0) {
          this.selectedFirm = this.firms[0].name;  // Set the first firm as the default selection
      }

    }
    })
  }

  setDefaultProfilePicture() {
    this.http.get(this.defaultImageUrl, { responseType: 'blob' }).subscribe(blob => {
      this.profilePicture = new File([blob], 'deafult.jpg', { type: blob.type });
    });
  }

  onFileSelected(event: any) {
    // Get the selected file from the event
    this.profilePicture = event.target.files[0];
  }

  resetForm() {
    // Reset all form fields
    this.username = '';
    this.password = '';
    this.firstname = '';
    this.lastname = '';
    this.gender = '';
    this.address = '';
    this.phoneNumber = 0;
    this.email = '';
    this.profilePicture = new File([], 'placeholder');
    this.errorMessage = '';
  }

  validatePassword(password: string): boolean {
    // Regular expression to validate password
    const regex =
      /^(?=[a-zA-Z])(?=(?:.*[A-Z]){1,})(?=(?:.*[a-z]){3,})(?=(?:.*\d){1,})(?=(?:.*[\W_]){1,})[a-zA-Z\d\W_]{6,10}$/;

    return regex.test(password);
  }

  validateEmail(email: string): boolean {
    // Regular expression to validate email address
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  validateProfilePictureSize(
    file: File,
    callback: (isValid: boolean) => void
  ): void {
    const img = new Image();
    img.src = window.URL.createObjectURL(file);

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      if (width >= 100 && height >= 100 && width <= 300 && height <= 300) {
        callback(true);
      } else {
        callback(false);
      }
    };

    img.onerror = () => {
      this.errorMessage = 'Failed to load image.';
      callback(false); // Error occurred, so profile picture is not valid
    };
  }

cardType: string = '';
cardTypeIcon: string = '';

validateCreditCardNumber() {
  const dinersRegex = /^(300|301|302|303|36|38)\d{11}$/;
  const masterCardRegex = /^(51|52|53|54|55)\d{14}$/;
  const visaRegex = /^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/;

  if (dinersRegex.test(this.creditCardNumber.toString())) {
    this.cardType = 'Diners Club';
    this.cardTypeIcon = 'assets/diner.png';
  } else if (masterCardRegex.test(this.creditCardNumber.toString())) {
    this.cardType = 'MasterCard';
    this.cardTypeIcon = 'assets/mastercard.png';
  } else if (visaRegex.test(this.creditCardNumber.toString())) {
    this.cardType = 'Visa';
    this.cardTypeIcon = 'assets/visa.png';
  } else {
    this.cardType = '';
    this.cardTypeIcon = '';
  }
}



  register() {
    if (this.profilePicture.name === "placeholder" || this.profilePicture.size === 0) {
      // If no profile picture is selected, use the default image
      this.http.get(this.defaultImageUrl, { responseType: 'blob' }).subscribe(blob => {
        this.profilePicture = new File([blob], 'default.jpg', { type: blob.type });
        this.finalizeRegistration(); // Proceed with registration after setting default image
      });
    } else {
      // If a profile picture is selected, validate its size
      this.validateProfilePictureSize(this.profilePicture, (isValidSize: boolean) => {
        if (!isValidSize) {
          this.errorMessage = 'Profile picture must be between 100x100 px and 300x300 px in size.';
        } else {
          this.finalizeRegistration(); // Proceed with registration if the picture size is valid
        }
      });
    }
  }

  finalizeRegistration() {
    // Validate password
    if (!this.validatePassword(this.password)) {
        this.errorMessage = 'Password must be between 6 and 10 characters long, contain at least one uppercase letter, three lowercase letters, one digit, one special character, and start with a letter.';
        return;
    }

    // Validate email
    if (!this.validateEmail(this.email)) {
        this.errorMessage = 'Email is not in the right format (example: something@something.something).';
        return;
    }

    // Validate credit card number
    const dinersRegex = /^(300|301|302|303|36|38)\d{11}$/;
    const masterCardRegex = /^(51|52|53|54|55)\d{14}$/;
    const visaRegex = /^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/;

    if (!dinersRegex.test(this.creditCardNumber.toString()) &&
        !masterCardRegex.test(this.creditCardNumber.toString()) &&
        !visaRegex.test(this.creditCardNumber.toString())) {
        this.errorMessage = 'Invalid credit card number. Please ensure the card number is correct and matches one of the supported card types (Diners Club, MasterCard, Visa).';
        return;
    }

    // Check if the username already exists
    this.service.getUserByUsername(this.username).subscribe((data: string) => {
        if (data) {
            this.errorMessage = 'Username is already taken';
            return;
        } else {
            // Check if the email already exists
            this.service.grabUserByEmail(this.email).subscribe((data: User) => {
                if (data) {
                    this.errorMessage = 'Email is already taken';
                    return;
                } else {
                    const formData = new FormData();

                    // Append fields to FormData object
                    formData.append('username', this.username);
                    formData.append('password', this.password);
                    formData.append('type', 'decorator');
                    formData.append('firstname', this.firstname);
                    formData.append('lastname', this.lastname);
                    formData.append('gender', this.gender);
                    formData.append('address', this.address);
                    formData.append('phoneNumber', this.phoneNumber.toString());
                    formData.append('email', this.email);
                    formData.append('creditCardNumber', this.creditCardNumber.toString());
                    formData.append('profilePicture', this.profilePicture, this.profilePicture.name);
                    formData.append('firmName', this.selectedFirm);

                    // Send the form data to the backend
                    this.serviceAdmin.registerDecorator(formData).subscribe((data: string) => {
                        if (data) {
                            alert(data);
                            this.resetForm();
                        } else {
                            alert("Error in registration!");
                            this.resetForm();
                        }
                    });
                }
            });
        }
    });
  }
}
