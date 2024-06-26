import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';
import { Product } from '../models/product';
import { SettingsResponse } from '../models/settings-response';

@Component({
  selector: 'app-product-create-modal',
  templateUrl: './product-create-modal.component.html',
  styleUrls: ['./product-create-modal.component.scss']
})
export class ProductCreateModalComponent implements OnInit {
  productForm!: FormGroup;
  defaultTax: number =0;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private userService: UserService,
    public dialogRef: MatDialogRef<ProductCreateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.userService.getUserSettings().subscribe(
      (settingsResponse: SettingsResponse) => {
        this.defaultTax =settingsResponse.taxPercentage || 0;
        this.productForm.patchValue({ tax: this.defaultTax });
      },
      (error) => {
        console.error('Failed to retrieve user settings:', error);
      }
    );

  }

  initializeForm(): void {
    this.productForm = this.formBuilder.group({
      reference: [''],
      designation: ['', [Validators.required]],
      purchasePrice: ['', [Validators.required, Validators.min(0)]],
      sellingPrice: ['' , [Validators.required, Validators.min(0)]],
      profitMargin: ['', [Validators.required, Validators.min(0)]],
      tax: [this.defaultTax.toString(), [Validators.required, Validators.min(0)]],
      lastUpdated: [new Date(), [Validators.required]]
    });

    this.productForm.get('purchasePrice')?.valueChanges.subscribe(() => {
      this.calculateProfitMargin();
    });
  
    this.productForm.get('sellingPrice')?.valueChanges.subscribe(() => {
      this.calculateProfitMargin();
    });
  }

  calculateProfitMargin(): void {
    const purchasePrice = parseFloat(this.productForm.get('purchasePrice')?.value);
    const sellingPrice = parseFloat(this.productForm.get('sellingPrice')?.value);
  
    if (!isNaN(purchasePrice) && !isNaN(sellingPrice) && purchasePrice !== 0) {
      let profitMargin = ((sellingPrice - purchasePrice) / sellingPrice) * 100;
  
      profitMargin = Math.min(profitMargin, 100);
  
      this.productForm.get('profitMargin')?.setValue(profitMargin.toFixed(2));
    } else {
      this.productForm.get('profitMargin')?.setValue('');
    }
  }
  
  formatPrice(event: any, fieldName: string): void {
    const inputElement = event.target as HTMLInputElement;
    const selectionStart = inputElement.selectionStart;
    const selectionEnd = inputElement.selectionEnd;
  
    let inputValue = inputElement.value;
  
    inputValue = inputValue.replace(/[^0-9.]/g, '');
  
    const parts = inputValue.split('.');
    if (parts.length > 2) {
      inputValue = `${parts[0]}.${parts.slice(1).join('')}`;
    }
  
    if (parts[1] && parts[1].length > 2) {
      inputValue = `${parts[0]}.${parts[1].slice(0, 3)}`;
    }
  
    if (parts[0].length > 1 && parts[0][0] === '0' && parts[0][1] !== '.') {
      inputValue = parts[0].substring(1) + inputValue.substring(parts[0].length);
    }
  
    inputElement.value = inputValue;
  
    if (fieldName === 'purchasePrice') {
      this.productForm.get('purchasePrice')!.setValue(inputValue);
    }
  
    if (fieldName === 'sellingPrice') {
      this.productForm.get('sellingPrice')!.setValue(inputValue);
    }
  
    inputElement.setSelectionRange(selectionStart, selectionEnd);
  }
  
  formatPercentage(event: any): void {
    const inputElement = event.target as HTMLInputElement;
  
    let inputValue = inputElement.value;
  
    inputValue = inputValue.replace(/[^0-9.]/g, '');
    
    const parts = inputValue.split('.');
  
    if (parts[0] && parts[0].length > 2) {
      parts[0] = parts[0].slice(0, 2);
    }
  
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].slice(0, 2);
    }
  
    inputValue = parts.join('.');
  
    const dotCount = inputValue.split('.').length - 1;
    if (dotCount > 1) {
      const indexOfLastDot = inputValue.lastIndexOf('.');
      inputValue = inputValue.substring(0, indexOfLastDot) + inputValue.substring(indexOfLastDot + 1);
    }

    const taxControl = this.productForm.get('tax');
    if (taxControl) {
    taxControl.setValue(parseFloat(inputValue));
    }

    inputElement.value = inputValue;
  }
  
  saveProduct(): void {
    if (this.productForm.valid) {
      const newProduct: Product = this.productForm.value;
      this.productService.createProduct(newProduct).subscribe(
        (response) => {
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error creating product:', error);
        }
      );
    }
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
