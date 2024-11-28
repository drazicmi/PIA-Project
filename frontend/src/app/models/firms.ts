import { User } from "./user";

export class Firms {
  name: string = '';
  address: string = '';
  services : string[] = [];
  service_prices : number[] = [];
  longitude : number = 0;
  latitude : number = 0;
  decorator_list : string[] = [];
  vacation_start : Date = new Date();
  vacation_end : Date = new Date();
  contactNumber: number = 0;
}

