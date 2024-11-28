import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerMakeAppointmentComponent } from './owner-make-appointment.component';

describe('OwnerMakeAppointmentComponent', () => {
  let component: OwnerMakeAppointmentComponent;
  let fixture: ComponentFixture<OwnerMakeAppointmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerMakeAppointmentComponent]
    });
    fixture = TestBed.createComponent(OwnerMakeAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
