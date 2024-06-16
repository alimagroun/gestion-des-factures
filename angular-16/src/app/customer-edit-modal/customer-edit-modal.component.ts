import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer';

@Component({
  selector: 'app-customer-edit-modal',
  templateUrl: './customer-edit-modal.component.html',
  styleUrls: ['./customer-edit-modal.component.scss']
})
export class CustomerEditModalComponent implements OnInit {
  customerForm!: FormGroup;
  isSubmitting = false;
  formSubmitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CustomerEditModalComponent>,
    private customerService: CustomerService,
    @Inject(MAT_DIALOG_DATA) public customer: Customer 
  ) { }

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      firstName: [this.customer.firstName, [Validators.minLength(2), Validators.maxLength(50)]],
      lastName: [this.customer.lastName, [Validators.minLength(2), Validators.maxLength(50)]],
      email: [this.customer.email, [Validators.email]],
      phoneNumber: [this.customer.phoneNumber],
      companyName: [this.customer.companyName], 
      taxIdentificationNumber: [this.customer.taxIdentificationNumber],
      streetAddress: [this.customer.address ? this.customer.address.streetAddress : ''],
      city: [this.customer.address ? this.customer.address.city : ''],
      state: [this.customer.address ? this.customer.address.state : ''],
      postalCode: [this.customer.address ? this.customer.address.postalCode : '']
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
      customerData.id = this.customer.id;
      this.customerService.updateCustomer(this.customer.id, customerData)
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
