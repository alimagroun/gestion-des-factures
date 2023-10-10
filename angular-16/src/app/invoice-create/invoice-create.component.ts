import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, tap, filter } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Customer } from '../models/customer';

import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-invoice-create',
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.scss']
})
export class InvoiceCreateComponent {
  customerSearchControl = new FormControl();
  customers$!: Observable<Customer[]>;
  minSearchLength = 3;

  constructor(private customerService: CustomerService) {}

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
  
    this.customers$.subscribe(data => {
      console.log('Received data from the backend:', data);
    });
  }

  displayCustomerFn(customer: Customer): string {
    return customer ? `${customer.firstName} ${customer.lastName}` : '';
  }
}
