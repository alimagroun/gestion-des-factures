import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCreateModalComponent } from './product-create-modal.component';

describe('ProductCreateModalComponent', () => {
  let component: ProductCreateModalComponent;
  let fixture: ComponentFixture<ProductCreateModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCreateModalComponent]
    });
    fixture = TestBed.createComponent(ProductCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
