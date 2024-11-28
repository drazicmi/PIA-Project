import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firms } from 'src/app/models/firms';
import { User } from 'src/app/models/user';
import { OwnerService } from 'src/app/services/owner.service';

@Component({
  selector: 'app-owner-firm-details',
  templateUrl: './owner-firm-details.component.html',
  styleUrls: ['./owner-firm-details.component.css']
})
export class OwnerFirmDetailsComponent implements OnInit {
  firm: Firms = new Firms();
  currentStep = 1;
  appointmentData: any = { selectedServices: [], gardenLayout: null };
  gardenLayout: any = null;
  gardenType = '';
  errorMessage = '';
  successMessage = '';
  owner : User = new User();

  constructor(private router: Router, private service: OwnerService ) {}

  ngOnInit(): void {
    const tmp = localStorage.getItem('logged');
    if(tmp) {
      this.owner = JSON.parse(tmp);
    }
    const firmData = localStorage.getItem('selectedFirm');
    if (firmData) {
      this.firm = JSON.parse(firmData);
    }
    this.areDecoratorsAvailable();
  }


  nextStep() {
    if (this.validateStep(this.currentStep)) {
      this.currentStep++;
      this.errorMessage = '';
    }
  }


  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }


  validateStep(step: number): boolean {
    if (step === 1) {
      const { date, time, squareFootage, gardenType } = this.appointmentData;
      if (!date || !time || !squareFootage || !gardenType) {
        this.errorMessage = 'All fields in Step 1 are required.';
        return false;
      }
    } else if (step === 2) {
      if (!this.appointmentData.selectedServices || this.appointmentData.selectedServices.length === 0) {
        this.errorMessage = 'Please select at least one service.';
        return false;
      }


      if (!this.validateSquareFootage()) {
        this.errorMessage = `The total square footage for the garden cannot exceed ${this.appointmentData.squareFootage} sq ft.`;
        return false;
      }

      if (this.gardenType === 'private') {
        const { poolSquareFootage, greenerySquareFootage, sunbedsSquareFootage } = this.appointmentData;
        if (!poolSquareFootage || !greenerySquareFootage || !sunbedsSquareFootage) {
          this.errorMessage = 'All fields in Step 2 (Private Garden) are required.';
          return false;
        }
      } else if (this.gardenType === 'restaurant') {
        const { fountainSquareFootage, greenerySquareFootage, tableCount, chairCount } = this.appointmentData;
        if (!fountainSquareFootage || !greenerySquareFootage || !tableCount || !chairCount) {
          this.errorMessage = 'All fields in Step 2 (Restaurant Garden) are required.';
          return false;
        }
      }
    }
    return true;
  }

    validateSquareFootage(): boolean {
      let totalSquareFootage = 0;

      if (this.gardenType === 'private') {
        const { poolSquareFootage, greenerySquareFootage, sunbedsSquareFootage } = this.appointmentData;
        totalSquareFootage =
          Number(poolSquareFootage || 0) +
          Number(greenerySquareFootage || 0) +
          Number(sunbedsSquareFootage || 0);
      } else if (this.gardenType === 'restaurant') {
        const { fountainSquareFootage, greenerySquareFootage } = this.appointmentData;
        totalSquareFootage =
          Number(fountainSquareFootage || 0) +
          Number(greenerySquareFootage || 0);
      }

      return totalSquareFootage === Number(this.appointmentData.squareFootage);
    }

  // File input handler for JSON
onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        this.gardenLayout = JSON.parse(e.target.result);  // Store the parsed layout
        const hasOverlap = this.checkForOverlaps(this.gardenLayout.elements);

        if (hasOverlap) {
          this.errorMessage = 'Error: Some elements in the layout overlap!';
        } else {
          this.drawGardenLayout(this.gardenLayout);
          this.errorMessage = '';  // Clear the error if the layout is valid
        }
      } catch (error) {
        this.errorMessage = 'Error parsing JSON file';
        console.error(error);
      }
    };
    reader.readAsText(file);
  }
}

// Draw garden layout on the canvas
drawGardenLayout(layoutData: any): void {
  const canvas = document.getElementById('gardenCanvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (ctx && layoutData.elements) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    layoutData.elements.forEach((element: any) => {
      switch (element.type) {
        case 'greenery':
        case 'chair':
          ctx.fillStyle = element.type === 'greenery' ? 'green' : 'gray';
          ctx.fillRect(element.x, element.y, element.width, element.height);
          break;
        case 'pool':
          ctx.fillStyle = 'blue';
          ctx.fillRect(element.x, element.y, element.width, element.height);
          break;
        case 'fountain':
        case 'table':
          ctx.fillStyle = element.type === 'fountain' ? 'blue' : 'brown';
          ctx.beginPath();
          ctx.arc(element.x, element.y, element.radius, 0, 2 * Math.PI);
          ctx.fill();
          break;
      }
    });
  }
}

// Helper function to check if two rectangular elements overlap
isRectOverlap(rect1: any, rect2: any): boolean {
  return !(
    rect1.x + rect1.width < rect2.x ||
    rect2.x + rect2.width < rect1.x ||
    rect1.y + rect1.height < rect2.y ||
    rect2.y + rect2.height < rect1.y
  );
}

// Helper function to check if two circular elements overlap
isCircleOverlap(circle1: any, circle2: any): boolean {
  const dx = circle1.x - circle2.x;
  const dy = circle1.y - circle2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < circle1.radius + circle2.radius;
}

// Helper function to check for overlap between a rectangle and a circle
isRectCircleOverlap(rect: any, circle: any): boolean {
  const distX = Math.abs(circle.x - rect.x - rect.width / 2);
  const distY = Math.abs(circle.y - rect.y - rect.height / 2);

  if (distX > rect.width / 2 + circle.radius || distY > rect.height / 2 + circle.radius) {
    return false;
  }

  if (distX <= rect.width / 2 || distY <= rect.height / 2) {
    return true;
  }

  const dx = distX - rect.width / 2;
  const dy = distY - rect.height / 2;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

// Function to check for overlaps between elements in the garden layout
checkForOverlaps(elements: any[]): boolean {
  for (let i = 0; i < elements.length; i++) {
    const element1 = elements[i];

    for (let j = i + 1; j < elements.length; j++) {
      const element2 = elements[j];

      // Check if both elements are rectangles (e.g., greenery, chair, pool)
      if (['greenery', 'chair', 'pool'].includes(element1.type) && ['greenery', 'chair', 'pool'].includes(element2.type)) {
        if (this.isRectOverlap(element1, element2)) {
          return true;
        }
      }

      // Check if both elements are circles (e.g., fountain, table)
      if (['fountain', 'table'].includes(element1.type) && ['fountain', 'table'].includes(element2.type)) {
        if (this.isCircleOverlap(element1, element2)) {
          return true;
        }
      }

      // Check if one element is a rectangle and the other is a circle
      if (['greenery', 'chair', 'pool'].includes(element1.type) && ['fountain', 'table'].includes(element2.type)) {
        if (this.isRectCircleOverlap(element1, element2)) {
          return true;
        }
      }
      if (['fountain', 'table'].includes(element1.type) && ['greenery', 'chair', 'pool'].includes(element2.type)) {
        if (this.isRectCircleOverlap(element2, element1)) {
          return true;
        }
      }
    }
  }
  return false; // No overlaps found
}



  isCompanyOpen(date: string): boolean {
    const selectedDate = new Date(date);

    const vacationStart = new Date(this.firm.vacation_start);
    const vacationEnd = new Date(this.firm.vacation_end);

    return !(selectedDate >= vacationStart && selectedDate <= vacationEnd);
  }

  availableDecorators: boolean = false;

  areDecoratorsAvailable(): void {
  this.service.grabDecoratorsCount(this.firm.name).subscribe(
    (data: User[]) => {
      if (data) {
        this.availableDecorators = data.length > 0;
      } else {
        this.availableDecorators = false;
      }
      console.log('Available decorators:', this.availableDecorators);
    },
    err => {
      console.error('Error:', err);
      this.availableDecorators = false;
    }
  );
}



  submitForm() {
    if (!this.validateSquareFootage()) {
      this.errorMessage = `The total square footage for the garden cannot exceed ${this.appointmentData.squareFootage} sq ft.`;
      this.appointmentData.selectedServices = [];
      return;
    }

    if (this.validateStep(this.currentStep)) {
      if (!this.isCompanyOpen(this.appointmentData.date)) {
        this.errorMessage = 'The company is on vacation on the selected day. Please choose another date.';
        this.appointmentData.selectedServices = [];
        return;
      }

      if (!this.availableDecorators) {
        this.errorMessage = 'There are no available decorators for this appointment. Please choose another date.';
        this.appointmentData.selectedServices = [];
        return;
      }

      this.appointmentData.gardenLayout = this.gardenLayout;

      const formData = new FormData();

      formData.append('schedulingDate', new Date().toISOString());
      formData.append('date', this.appointmentData.date);
      formData.append('time', this.appointmentData.time);
      formData.append('squareFootage', this.appointmentData.squareFootage.toString());
      formData.append('gardenType', this.appointmentData.gardenType);
      formData.append('services', JSON.stringify(this.appointmentData.selectedServices));
      formData.append('additionalDescription', this.appointmentData.additionalDescription || '');

      formData.append('firm', JSON.stringify(this.firm));
      formData.append('owner', JSON.stringify(this.owner));

      formData.append('totalSquareFootage', this.appointmentData.squareFootage.toString());
      formData.append('poolSquareFootage', this.appointmentData.poolSquareFootage ? this.appointmentData.poolSquareFootage.toString() : '0');
      formData.append('greenerySquareFootage', this.appointmentData.greenerySquareFootage ? this.appointmentData.greenerySquareFootage.toString() : '0');
      formData.append('sunbedsSquareFootage', this.appointmentData.sunbedsSquareFootage ? this.appointmentData.sunbedsSquareFootage.toString() : '0');
      formData.append('fountainSquareFootage', this.appointmentData.fountainSquareFootage ? this.appointmentData.fountainSquareFootage.toString() : '0');
      formData.append('tableCount', this.appointmentData.tableCount ? this.appointmentData.tableCount.toString() : '0');
      formData.append('chairCount', this.appointmentData.chairCount ? this.appointmentData.chairCount.toString() : '0');
      formData.append('gardenLayout', JSON.stringify(this.appointmentData.gardenLayout));

      this.service.createAppointment(formData).subscribe(
        (response) => {
          console.log('Appointment created successfully:', response);
          this.errorMessage = '';
        this.goBack();
        },
        (error) => {
          console.error('Error creating appointment:', error);
          this.errorMessage = 'Error creating appointment. Please try again later.';
        }
      );

    }
  }

  // Handle the selection of services
  toggleServiceSelection(service: string) {
    const index = this.appointmentData.selectedServices.indexOf(service);
    if (index === -1) {
      // Add service if not already selected
      this.appointmentData.selectedServices.push(service);
    } else {
      // Remove service if already selected
      this.appointmentData.selectedServices.splice(index, 1);
    }
  }

  // Set garden type and reset form data related to square footage
  onGardenTypeChange(event: any) {
    this.gardenType = event.target.value;
    this.appointmentData = { ...this.appointmentData, poolSquareFootage: '', greenerySquareFootage: '', sunbedsSquareFootage: '' };
  }

  // Method to navigate back to the firms list
  goBack() {
    this.router.navigate(['owner/firms']);  // Update the navigation path
  }
}
