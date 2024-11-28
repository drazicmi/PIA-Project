import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';


  type : String = '';


  constructor(private router: Router) {}

  showLoginButton(): boolean {
    const currentRoute = this.router.url;
    // if( currentRoute === '/admin' ) { return false; }
    return currentRoute === '/' || currentRoute === '/login' || currentRoute === '/credentials-change' || currentRoute === '/register';
  }

  showLogoutButton(): boolean {
    return !this.showLoginButton();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToMainMenu() {
    const logged = JSON.parse(localStorage.getItem("logged") || '{}');
    this.type = logged.type || "";
    switch(this.type) {
      case "admin": {
        this.router.navigate(['/admin/base']);
        break;
      }
      case "owner": {
        this.router.navigate(['/owner']);
        break;
      }
      case "decorator": {
        this.router.navigate(['/decorator']);
        break;
      }
      default: {
        this.router.navigate(['']);
        break;
      }
    }
  }
}
