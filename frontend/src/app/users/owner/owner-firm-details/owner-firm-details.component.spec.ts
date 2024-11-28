import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerFirmDetailsComponent } from './owner-firm-details.component';

describe('OwnerFirmDetailsComponent', () => {
  let component: OwnerFirmDetailsComponent;
  let fixture: ComponentFixture<OwnerFirmDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerFirmDetailsComponent]
    });
    fixture = TestBed.createComponent(OwnerFirmDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
