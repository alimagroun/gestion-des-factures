import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductCreateModalComponent } from '../product-create-modal/product-create-modal.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {

  constructor(private dialog: MatDialog) {}

openCreateProductModal(): void {
  const dialogRef = this.dialog.open(ProductCreateModalComponent, {
    width: 'auto', // Set the desired width
  });

  dialogRef.afterClosed().subscribe(result => {
    // Handle the result when the modal is closed (e.g., after submitting the form)
    console.log(`Dialog result: ${result}`);
  });
}
}
