import { Component, OnInit, ViewChild } from '@angular/core';
import { Invoice } from '../models/invoice';
import { InvoiceService } from '../services/invoice.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogService } from '../services/DialogService';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  invoicesDataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'select',
    'invoiceNumber',
    'customer',
    'date',
    'totalAmount',
    'state',
    'action',
  ];
  selectedRows: Invoice[] = [];
  showSupprimerButton: boolean = false;
  showCheckbox: boolean = false;
  selectAllChecked: boolean = false;
  invoice! : Invoice;

  constructor(private invoiceService: InvoiceService, private router: Router, private dialogService: DialogService) {}

  ngOnInit(): void {
    this.loadInvoices(0,10);
  }

  loadInvoices(page: number, size: number): void {
    this.invoiceService.getAllInvoices(page, size).subscribe(
      (pageResponse) => {
        this.invoicesDataSource = new MatTableDataSource(pageResponse.content);
        this.paginator.length = pageResponse.totalElements;
        this.invoicesDataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error loading invoices:', error);
      }
    );
  }

  onPageChange(event: PageEvent): void {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    this.loadInvoices(pageIndex, pageSize);
  }

  viewInvoice(invoiceId: number) {
    this.router.navigate(['/invoice', invoiceId]);
  }

  deleteInvoice(id: number): void {
    this.invoiceService.deleteInvoice(id).subscribe(
      () => {
        this.loadInvoices(0,10);
      },
      (error) => {
        console.error('Error deleting invoice:', error);
      }
    );
  }

  onDeleteInvoice(selectedRows: Invoice[]): void {
    const currentPageIndex = this.paginator.pageIndex;
    const currentPageSize = this.paginator.pageSize;
    const confirmationMessage = `Voulez-vous vraiment supprimer ${selectedRows.length > 1 ? 'ces articles' : 'cet article'} ?`;
  
    this.dialogService
      .openDeleteConfirmationDialog(confirmationMessage)
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          selectedRows.forEach((invoice, index) => {
            this.invoiceService.deleteInvoice(invoice.id ?? -1).subscribe(
              () => {
                this.invoicesDataSource.data = this.invoicesDataSource.data.filter(item => item.id !== invoice.id);
  
                const totalProductsCount = this.invoicesDataSource.data.length;
  
                if (totalProductsCount === 0) {
                  if (currentPageIndex > 0) {
                    this.paginator.pageIndex = currentPageIndex - 1;
                  } else {
                    this.paginator.pageIndex = 0;
                  }
                }
  
                this.loadInvoices(this.paginator.pageIndex, currentPageSize);
                this.showSupprimerButton =false;
                this.selectAllChecked = false;
              },
              (error) => {
                console.error(`Error deleting product ${invoice.id}:`, error);
              }
            );
          });
        } else {
          console.log('Delete canceled');
        }
      });
  }

  selectAllRows(event: any) {
    this.showSupprimerButton = event.checked;
  
    this.selectedRows = [];
  
    if (event.checked) {
      this.invoicesDataSource.data.forEach((item) => {
        item.isSelected = true;
        this.selectedRows.push(item);
      });
    } else {
      this.invoicesDataSource.data.forEach((item) => (item.isSelected = false));
    }
  }
  
  selectRow(row: any) {
    this.selectedRows = this.invoicesDataSource.data.filter((item) => item.isSelected);
  
    if (this.selectedRows.length === 1) {
      this.invoice = this.selectedRows[0];
    } else {
      this.invoice = {} as Invoice;
    }
  
    this.showSupprimerButton = this.selectedRows.length > 0;
  
    const allProductsSelected = this.invoicesDataSource.data.every((item) => item.isSelected);
    this.selectAllChecked = allProductsSelected;
  }
}
