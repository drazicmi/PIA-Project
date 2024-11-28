import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {



  public constructor (private service : LoginService, private rotuer : Router) {}

  username : string = '';
  password : string = '';
  errorMessage : string = '';

  loginUser () {
    this.service.loginUser(this.username, this.password).subscribe( (data : User) => {
      if(data) {
        if ( data.type == 'admin') {
          localStorage.setItem('logged', JSON.stringify(data));
          this.rotuer.navigate(['admin/base']);
        }
        else {
          this.errorMessage = "Users have separete login page!"
        }
      }
      else {
        this.errorMessage = "You entered wrong credentials!"
      }

    })
  }

  changeCredentials() {
    this.rotuer.navigate(['credentials-change']);
  }

}
