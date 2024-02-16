import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Page } from '../models/page';
import { Product } from '../models/product';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ProductCreateModalComponent } from '../product-create-modal/product-create-modal.component';
import { ProductEditModalComponent } from '../product-edit-modal/product-edit-modal.component';
import { DialogService } from '../services/DialogService';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['select','reference', 'designation', 'sellingPrice', 'purchasePrice', 'tax', 'ttc', 'lastUpdate'];
  showModifierButton: boolean = false;
  showSupprimerButton: boolean = false;
  showCheckbox: boolean = false;
  selectAllChecked: boolean = false;
  product!: Product;
  selectedRows: Product[] = [];
  loading: boolean = false;
  
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private dialog: MatDialog, private productService: ProductService, private dialogService: DialogService) {}

  ngOnInit(): void {
    this.loadProducts(0, 10);
  }

  loadProducts(page: number, size: number): void {
    this.loading=true;
    this.productService.getAllProducts(page, size).subscribe((data: Page<any>) => {
      this.dataSource = new MatTableDataSource(data.content);
      this.paginator.length = data.totalElements;
      this.showCheckbox = data.totalElements > 0;
    });
    this.loading=false;
  }

  onPageChange(event: any): void {
    this.selectAllChecked = false;
    this.showModifierButton = false;
    this.showSupprimerButton = false;
    const page = event.pageIndex;
    const size = event.pageSize;
    this.loadProducts(page, size);
  }

  openCreateProductModal(): void {
  const dialogRef = this.dialog.open(ProductCreateModalComponent, {
    width: 'auto',
  });

  dialogRef.afterClosed().subscribe((result: any) => {
    if (result === true) {
  
      this.loadProducts(this.paginator.pageIndex, this.paginator.pageSize);
    }
  });
}

  openEditProductModal(product: Product): void {
  const dialogRef = this.dialog.open(ProductEditModalComponent, {
    width: 'auto',
    data: product 
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.loadProducts(this.paginator.pageIndex, this.paginator.pageSize);
      this.showModifierButton = false;
      this.showSupprimerButton = false;
    }
  });
}

onDeleteProduct(selectedRows: Product[]): void {
  const currentPageIndex = this.paginator.pageIndex;
  const currentPageSize = this.paginator.pageSize;
  const confirmationMessage = `Voulez-vous vraiment supprimer ${selectedRows.length > 1 ? 'ces articles' : 'cet article'} ?`;

  this.dialogService
    .openDeleteConfirmationDialog(confirmationMessage)
    .subscribe((confirmed: boolean) => {
      if (confirmed) {
        selectedRows.forEach((product, index) => {
          this.productService.deleteProduct(product.id).subscribe(
            () => {
              this.dataSource.data = this.dataSource.data.filter(item => item.id !== product.id);

              const totalProductsCount = this.dataSource.data.length;

              if (totalProductsCount === 0) {
                if (currentPageIndex > 0) {
                  this.paginator.pageIndex = currentPageIndex - 1;
                } else {
                  this.paginator.pageIndex = 0;
                }
              }

              this.loadProducts(this.paginator.pageIndex, currentPageSize);
              this.showModifierButton = false;
              this.showSupprimerButton =false;
              this.selectAllChecked = false;
            },
            (error) => {
              console.error(`Error deleting product ${product.id}:`, error);
            }
          );
        });
      } else {
        console.log('Delete canceled');
      }
    });
}

selectAllRows(event: any) {
  this.showModifierButton = false;
  this.showSupprimerButton = event.checked;

  this.selectedRows = [];

  if (event.checked) {
    this.dataSource.data.forEach((item) => {
      item.isSelected = true;
      this.selectedRows.push(item);
    });
  } else {
    this.dataSource.data.forEach((item) => (item.isSelected = false));
  }
}

selectRow(row: any) {
  this.selectedRows = this.dataSource.data.filter((item) => item.isSelected);

  if (this.selectedRows.length === 1) {
    this.product = this.selectedRows[0];
    this.showModifierButton = true;
  } else {
    this.product = new Product();
    this.showModifierButton = false;
  }

  this.showSupprimerButton = this.selectedRows.length > 0;

  const allProductsSelected = this.dataSource.data.every((item) => item.isSelected);
  this.selectAllChecked = allProductsSelected;
}

}
