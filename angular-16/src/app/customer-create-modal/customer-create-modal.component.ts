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
    public dialogRef: MatDialogRef<CustomerCreateModalComponent>,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName:  ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['']
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

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
