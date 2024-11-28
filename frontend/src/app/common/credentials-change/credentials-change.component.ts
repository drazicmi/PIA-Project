import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-credentials-change',
  templateUrl: './credentials-change.component.html',
  styleUrls: ['./credentials-change.component.css']
})
export class CredentialsChangeComponent {

  constructor (private service : LoginService, private router: Router) {}

  username : string = '';
  password : string = '';
  newPassword : string = '';
  newPasswordAgain : string = '';
  errorMessage : string = '';

  // Function to validate the password format
  validatePassword(password: string): boolean {
    // Regular expression to validate password format
    const regex = /^(?=[a-zA-Z])(?=(?:.*[A-Z]){1,})(?=(?:.*[a-z]){3,})(?=(?:.*\d){1,})(?=(?:.*[\W_]){1,})[a-zA-Z\d\W_]{6,10}$/;
    return regex.test(password);
  }

  changeCredentials() {
    if (this.newPassword !== this.newPasswordAgain) {
      this.errorMessage = "Passwords that you entered don't match."
    }
    else if (this.validatePassword(this.newPassword) == false) {
        this.errorMessage = 'Password must be between 6 and 10 characters long, contain at least one uppercase letter, three lowercase letters, one digit, one special character, and start with a letter.';
    }
    else {
      this.service.tryChangePassword(this.username, this.password, this.newPassword).subscribe( (data : string) => {
        if (data) {
            this.errorMessage = data;
        } else {
            alert("Succesfull credential change!");
            this.router.navigate(['login']);
        }
      })
    }
  }

}
