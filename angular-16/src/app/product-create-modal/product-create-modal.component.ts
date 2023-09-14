import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';

@Component({
  selector: 'app-product-create-modal',
  templateUrl: './product-create-modal.component.html',
  styleUrls: ['./product-create-modal.component.scss']
})
export class ProductCreateModalComponent implements OnInit {
  productForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductCreateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.productForm = this.formBuilder.group({
      reference: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      purchasePrice: ['', [Validators.required, Validators.min(0)]],
      sellingPrice: ['' , [Validators.required, Validators.min(0)]],
      profitMargin: ['0.00 %', [Validators.required, Validators.min(0)]],
      tax: ['20.00 %', [Validators.required, Validators.min(0)]],
      lastUpdated: [new Date(), [Validators.required]]
    });
  }

  formatPrice(event: any): void {
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
      inputValue = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }
  
    if (parts[0].length > 1 && parts[0][0] === '0' && parts[0][1] !== '.') {
      inputValue = parts[0].substring(1) + inputValue.substring(parts[0].length);
    }
  
    inputElement.value = inputValue;
  
    inputElement.setSelectionRange(selectionStart, selectionEnd);
  }
  
  saveProduct(): void {
    if (this.productForm.valid) {
      const newProduct: Product = this.productForm.value;
      this.productService.createProduct(newProduct).subscribe(
        (response) => {
          // Successfully created the product, you can handle the response as needed
          console.log('Product created:', response);
          this.dialogRef.close(true);
        },
        (error) => {
          // Handle any errors that occur during the creation process
          console.error('Error creating product:', error);
        }
      );
    }
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
