import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, tap, filter } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Page } from '../models/page';
import { Customer } from '../models/customer';
import { Product } from '../models/product';

import { CustomerService } from '../services/customer.service';
import { ProductService } from '../services/product.service';


@Component({
  selector: 'app-invoice-create',
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.scss']
})
export class InvoiceCreateComponent {
  customerSearchControl = new FormControl();
  productSearchControl = new FormControl();
  customers$!: Observable<Customer[]>;
  products$!: Observable<Page<Product>>;
  minSearchLength = 3;

  constructor(private customerService: CustomerService, private productService: ProductService) {}

  ngOnInit() {
    this.customers$ = this.customerSearchControl.valueChanges
      .pipe(
        debounceTime(800),
        filter(prefix => typeof prefix === 'string'),
        filter(prefix => prefix.length >= this.minSearchLength),
        distinctUntilChanged(),
        tap(prefix => console.log('Prefix:', prefix)),
        switchMap(prefix => this.customerService.searchCustomersByPrefix(prefix))
      );

      this.products$ = this.productSearchControl.valueChanges
      .pipe(
        debounceTime(800),
        filter(prefix => typeof prefix === 'string'),
        filter(prefix => prefix.length >= this.minSearchLength),
        distinctUntilChanged(),
        tap(prefix => console.log('Product Prefix:', prefix)),
        switchMap(prefix => this.productService.searchProductsByPrefix(prefix, 0, 10)) // Adjust page and size as needed
      );
  
    this.customers$.subscribe(data => {
      console.log('Received data from the backend:', data);
    });
  }

  displayCustomerFn(customer: Customer): string {
    return customer ? `${customer.firstName} ${customer.lastName}` : '';
  }

  displayProductFn(product: Product): string {
    return product ? product.designation : '';
  }

  loadMore(){
    
  }
}
