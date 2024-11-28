export class Appointment {
  _id : string = '';
  schedulingDate: Date = new Date();
  date: Date = new Date();
  time: string = '';
  squareFootage: number = 0;
  gardenType: string = '';
  services: string[] = [];
  additionalDescription: string = '';
  totalSquareFootage: number = 0;
  poolSquareFootage: number = 0;
  greenerySquareFootage: number = 0;
  sunbedsSquareFootage: number = 0;
  fountainSquareFootage: number = 0;
  tableCount: number = 0;
  chairCount: number = 0;
  decoratorDecision: string = '';
  decorator_id: string = '';

  // firm object with only _id and name
  firm: {
    _id: string;
    name: string;
  } = { _id: '', name: '' };

  // owner object with only _id and name
  owner: {
    _id: string;
    name: string;
  } = { _id: '', name: '' };

  gardenLayout: any = null;
  showDenialForm: boolean = false;
}
