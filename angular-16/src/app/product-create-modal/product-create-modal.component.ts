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

    this.productForm.get('sellingPrice')?.valueChanges.subscribe((value) => {
      if (value !== null && value !== '') {
        // Parse the value to a number (excluding TND)
        const numericValue = parseFloat(value.replace(' TND', ''));
  
        // Format the number as desired (up to 19 digits on the left, 2 digits on the right)
        const formattedValue = numericValue.toFixed(2);
  
        // Update the form control with the formatted value (including TND)
        this.productForm.get('sellingPrice')?.setValue(`${formattedValue} TND`, {
          emitEvent: false, // Avoid triggering infinite changes
        });
      }
    });
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
