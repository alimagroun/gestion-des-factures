import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
  formSubmitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CustomerCreateModalComponent>,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      firstName: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.email]],
      phoneNumber: [''],
      companyName: [''], 
      taxIdentificationNumber: [''], 
      streetAddress: [''],
      city: [''],
      state: [''],
      postalCode: ['']
    }, { validators: this.lastNameOrCompanyNameValidator });
}

lastNameOrCompanyNameValidator(control: AbstractControl): ValidationErrors | null {
  const lastName = control.get('lastName')?.value;
  const companyName = control.get('companyName')?.value;

  if (!lastName && !companyName) {
    return { lastNameOrCompanyName: true };
  }
  return null;
}

get lastNameOrCompanyNameInvalid(): boolean {
  return this.customerForm.hasError('lastNameOrCompanyName') && this.formSubmitted;
}
 
  onSubmit(): void {
    this.formSubmitted = true;
    if (this.customerForm.valid) {
      this.isSubmitting = true;
      const customerData: Customer = this.customerForm.value;
      this.customerService.createCustomer(customerData)
        .subscribe(
          (response) => {
            this.isSubmitting = false;
            this.dialogRef.close(true);
          },
          (error) => {
            this.isSubmitting = false;
          }
        );
    }
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
