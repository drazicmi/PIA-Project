import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {

  public constructor (private service : LoginService, private rotuer : Router) {}

  username : string = '';
  password : string = '';
  errorMessage : string = '';

  loginUser () {
    this.service.loginUser(this.username, this.password).subscribe( (data : User) => {
      if(data) {
        if( data.type == 'owner') {
          if (data.isApproved == 'pending') {
            this.errorMessage = "Your registration is still pending!";
          }
          else if (data.isApproved == 'rejected') {
              this.errorMessage = "Your registration was rejected!";
          }
          else {
            localStorage.setItem('logged', JSON.stringify(data));
            this.rotuer.navigate(['owner']);
          }
        }
        else if ( data.type == 'decorator' ) {
          localStorage.setItem('logged', JSON.stringify(data));
          this.rotuer.navigate(['decorator']);
        }
        else {
          this.errorMessage = "Admin has separete login page!";
        }
      }
      else {
        this.errorMessage = "You entered wrong credentials!";
      }

    })
  }

  changeCredentials() {
    this.rotuer.navigate(['credentials-change']);
  }

  register() {
    this.rotuer.navigate(['register']);
  }


}
