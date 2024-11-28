import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Firms } from '../models/firms';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http : HttpClient) { }


  loginUser (username : string, password: string) {
    let data = {
      username : username,
      password : password
    }
    return this.http.post<User>("http://localhost:4000/users/loginUser", data)
  }


  tryChangePassword(username : string, password: string, newPassword: string) {
    let data = {
      username: username,
      password: password,
      newPassword: newPassword
    }
    return this.http.post<string>("http://localhost:4000/users/tryChangePassword", data)
  }

  getUserByUsername (username : string) {
    let data = { username : username }
    return this.http.post<string>("http://localhost:4000/users/getUserByUsername", data);
  }

  grabUserByEmail (email : string) {
    let data = { email : email }
    return this.http.post<User>("http://localhost:4000/users/grabUserByEmail", data);
  }

  registerUser (formData : FormData) {
    return this.http.post<string>("http://localhost:4000/users/registerUser", formData);
  }

  updateUser (formData : FormData) {
    return this.http.post<User>("http://localhost:4000/users/updateUser", formData);
  }

  updateOwner (formData : FormData) {
    return this.http.post<User>("http://localhost:4000/users/updateOwner", formData);
  }

  updateDecorator (formData : FormData) {
    return this.http.post<User>("http://localhost:4000/users/updateDecorator", formData);
  }


  grabOwnersCount ( ) {
    return this.http.get<number>("http://localhost:4000/users/grabOwnersCount");
  }


  grabDecoratedGardensCount() {
    return this.http.get<number>("http://localhost:4000/users/grabDecoratedGardensCount");
  }

  grabSchedualedGardensCount1() {
    return this.http.get<number>("http://localhost:4000/users/grabSchedualedGardensCount1");
  }

  grabSchedualedGardensCount7() {
    return this.http.get<number>("http://localhost:4000/users/grabSchedualedGardensCount7");
  }

  grabSchedualedGardensCount30() {
    return this.http.get<number>("http://localhost:4000/users/grabSchedualedGardensCount30");
  }

  grabAllOwnersAdminProfile () {
    return this.http.get<User[]>("http://localhost:4000/users/grabAllOwnersAdminProfile");
  }


  grabAllDecoratorsAdminProfile () {
    return this.http.get<User[]>("http://localhost:4000/users/grabAllDecoratorsAdminProfile");
  }

  grabAllFirmsAdminProfile () {
    return this.http.get<Firms[]>("http://localhost:4000/users/grabAllFirmsAdminProfile");
  }



  checkForFinishedAppointments(decoratorID: string) {
    let data = {
      decoratorID: decoratorID
    }
    return this.http.post<string>("http://localhost:4000/users/checkForFinishedAppointments", data);
  }

}
