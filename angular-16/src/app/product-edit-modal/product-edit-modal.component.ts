import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';

@Component({
  selector: 'app-product-edit-modal',
  templateUrl: './product-edit-modal.component.html',
  styleUrls: ['./product-edit-modal.component.scss']
})
export class ProductEditModalComponent implements OnInit {
  productForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    public dialogRef: MatDialogRef<ProductEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    // Initialize the form with the provided data for editing
    this.productForm = this.formBuilder.group({
      reference: [this.data.reference],
      designation: [this.data.designation, [Validators.required]],
      purchasePrice: [this.data.purchasePrice, [Validators.required, Validators.min(0)]],
      sellingPrice: [this.data.sellingPrice, [Validators.required, Validators.min(0)]],
      profitMargin: [this.data.profitMargin, [Validators.required, Validators.min(0)]],
      tax: [this.data.tax, [Validators.required, Validators.min(0)]]
    });

    this.productForm.get('purchasePrice')?.valueChanges.subscribe(() => {
      this.calculateProfitMargin();
    });

    this.productForm.get('sellingPrice')?.valueChanges.subscribe(() => {
      this.calculateProfitMargin();
    });
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      const editedProduct: Product = this.productForm.value;
      const productId: number = this.data.id; // Get the product ID from the data
      this.productService.updateProduct(productId, editedProduct).subscribe(
        (response) => {
          // Successfully updated the product, you can handle the response as needed
          console.log('Product updated:', response);
          this.dialogRef.close(true);
        },
        (error) => {
          // Handle any errors that occur during the update process
          console.error('Error updating product:', error);
        }
      );
    }
  }
  

  closeDialog(): void {
    this.dialogRef.close(false);
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
    const selectionStart = inputElement.selectionStart;
    const selectionEnd = inputElement.selectionEnd;
  
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
  
    inputElement.value = inputValue;
  
    inputElement.setSelectionRange(selectionStart, selectionEnd);
  }
}
