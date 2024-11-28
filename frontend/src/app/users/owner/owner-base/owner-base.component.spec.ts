import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerBaseComponent } from './owner-base.component';

describe('OwnerBaseComponent', () => {
  let component: OwnerBaseComponent;
  let fixture: ComponentFixture<OwnerBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerBaseComponent]
    });
    fixture = TestBed.createComponent(OwnerBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
