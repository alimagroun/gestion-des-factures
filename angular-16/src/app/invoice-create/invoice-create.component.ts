import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
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

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.customers$ = this.customerSearchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(prefix => this.customerService.searchCustomersByPrefix(prefix))
      );

    this.customers$.subscribe(data => {
      console.log('Received data from backend:', data);
    });
  }

  displayCustomerFn(customer: Customer): string {
    return customer ? `${customer.firstName} ${customer.lastName}` : '';
  }
}
