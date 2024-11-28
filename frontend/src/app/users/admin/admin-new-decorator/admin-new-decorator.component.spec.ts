import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewDecoratorComponent } from './admin-new-decorator.component';

describe('AdminNewDecoratorComponent', () => {
  let component: AdminNewDecoratorComponent;
  let fixture: ComponentFixture<AdminNewDecoratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminNewDecoratorComponent]
    });
    fixture = TestBed.createComponent(AdminNewDecoratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
