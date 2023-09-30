import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer';

@Component({
  selector: 'app-customer-create-modal',
  templateUrl: './customer-create-modal.component.html',
  styleUrls: ['./customer-create-modal.component.scss']
})
export class CustomerCreateModalComponent implements OnInit {
  customerForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CustomerCreateModalComponent>, // Change dialogRef to public
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['']
      // Add other customer properties and validators here
    });
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      this.isSubmitting = true;
      const customerData: Customer = this.customerForm.value;
      this.customerService.createCustomer(customerData)
        .subscribe(
          (response) => {
            this.isSubmitting = false;
            this.dialogRef.close(response);
          },
          (error) => {
            this.isSubmitting = false;
            // Handle error or display a message
          }
        );
    }
  }
}
