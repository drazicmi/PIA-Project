import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoratorMakeAppointmentComponent } from './decorator-make-appointment.component';

describe('DecoratorMakeAppointmentComponent', () => {
  let component: DecoratorMakeAppointmentComponent;
  let fixture: ComponentFixture<DecoratorMakeAppointmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecoratorMakeAppointmentComponent]
    });
    fixture = TestBed.createComponent(DecoratorMakeAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
