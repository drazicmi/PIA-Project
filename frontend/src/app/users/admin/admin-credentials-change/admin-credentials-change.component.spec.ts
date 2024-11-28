import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCredentialsChangeComponent } from './admin-credentials-change.component';

describe('AdminCredentialsChangeComponent', () => {
  let component: AdminCredentialsChangeComponent;
  let fixture: ComponentFixture<AdminCredentialsChangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCredentialsChangeComponent]
    });
    fixture = TestBed.createComponent(AdminCredentialsChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
