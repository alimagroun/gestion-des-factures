import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Page } from '../models/page';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ProductCreateModalComponent } from '../product-create-modal/product-create-modal.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['reference', 'designation', 'sellingPrice', 'purchasePrice', 'tax', 'ttc', 'lastUpdate'];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private dialog: MatDialog, private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts(0, 10);
  }

  loadProducts(page: number, size: number): void {
    this.productService.getAllProducts(page, size).subscribe((data: Page<any>) => {
      this.dataSource = new MatTableDataSource(data.content);
      this.paginator.length = data.totalElements;
    });
  }

  onPageChange(event: any): void {
    const page = event.pageIndex;
    const size = event.pageSize;
    this.loadProducts(page, size);
  }

openCreateProductModal(): void {
  const dialogRef = this.dialog.open(ProductCreateModalComponent, {
    width: 'auto',
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
}
}
