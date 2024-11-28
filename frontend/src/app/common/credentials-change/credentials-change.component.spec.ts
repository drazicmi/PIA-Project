import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialsChangeComponent } from './credentials-change.component';

describe('CredentialsChangeComponent', () => {
  let component: CredentialsChangeComponent;
  let fixture: ComponentFixture<CredentialsChangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CredentialsChangeComponent]
    });
    fixture = TestBed.createComponent(CredentialsChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
