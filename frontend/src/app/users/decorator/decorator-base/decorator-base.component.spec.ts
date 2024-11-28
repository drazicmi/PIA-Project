import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecoratorBaseComponent } from './decorator-base.component';

describe('DecoratorBaseComponent', () => {
  let component: DecoratorBaseComponent;
  let fixture: ComponentFixture<DecoratorBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecoratorBaseComponent]
    });
    fixture = TestBed.createComponent(DecoratorBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
