import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCreateModalComponent } from './customer-create-modal.component';

describe('CustomerCreateModalComponent', () => {
  let component: CustomerCreateModalComponent;
  let fixture: ComponentFixture<CustomerCreateModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerCreateModalComponent]
    });
    fixture = TestBed.createComponent(CustomerCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
