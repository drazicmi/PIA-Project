export class User {
  _id : string = '';
  username : string = '';
  password : string = '';
  type : string = '';
  firstname: string = '';
  lastname: string = '';
  gender: string = '';
  address: string = '';
  contactPhone: string = '';
  email: string = '';
  creditCardNumber : Number = 0;
  isApproved: string = '';
  profilePicture: File = new File([], 'placeholder');
  profilePictureType : string = '';
  firmName : string = '';
  busy : boolean = false;
}
