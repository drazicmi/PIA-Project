import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Firms } from '../models/firms';
import { Requests } from '../models/requests';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http : HttpClient) { }


  grabAllDecorators () {
    return this.http.get<User[]>("http://localhost:4000/users/grabAllDecorators")
  }


  addFirm (firm : Firms) {
    let data = {
      name: firm.name,
      address: firm.address,
      services: firm.services,
      service_prices: firm.service_prices,
      longitude: firm.longitude,
      latitude: firm.latitude,
      decorator_list: firm.decorator_list,
      vacation_start: firm.vacation_start,
      vacation_end: firm.vacation_end,
      contactNumber: firm.contactNumber
    }

    return this.http.post<string>("http://localhost:4000/users/addFirm", data);
  }

  getAllFirms () {
    return this.http.get<Firms[]>("http://localhost:4000/users/getAllFirms")
  }


  registerDecorator (formData : FormData) {
    return this.http.post<string>("http://localhost:4000/users/registerDecorator", formData);
  }

  grabAllRequests () {
    return this.http.get<Requests[]>("http://localhost:4000/users/grabAllRequests")
  }

  approveRequest (request : Requests) {
    request.user.isApproved = "approved"
    request.approved = true
    let data = {
      user : request.user,
      approved : request.approved
    }
    return this.http.post<string>("http://localhost:4000/users/approveRequest", request)
  }

  rejectRequest (request : Requests) {
    request.user.isApproved = "denied"
    request.approved = true
    let data = {
      user : request.user,
      approved : request.approved
    }
    return this.http.post<string>("http://localhost:4000/users/rejectRequest", data)
  }


  grabDecoratorsCount ( ) {
    return this.http.get<number>("http://localhost:4000/users/grabDecoratorsCount");
  }

}
