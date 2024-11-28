import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoratorProfileComponent } from './decorator-profile.component';

describe('DecoratorProfileComponent', () => {
  let component: DecoratorProfileComponent;
  let fixture: ComponentFixture<DecoratorProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecoratorProfileComponent]
    });
    fixture = TestBed.createComponent(DecoratorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
