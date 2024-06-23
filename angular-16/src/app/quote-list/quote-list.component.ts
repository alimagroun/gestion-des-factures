import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Invoice } from '../models/invoice';
import { InvoiceService } from '../services/invoice.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from '../services/DialogService';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-quote-list',
  templateUrl: './quote-list.component.html',
  styleUrls: ['./quote-list.component.scss']
})
export class QuoteListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  invoicesDataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'select',
    'invoiceNumber',
    'customer',
    'date',
    'totalAmount',
    'action',
  ];
  selectedRows: Invoice[] = [];
  showSupprimerButton: boolean = false;
  showCheckbox: boolean = false;
  selectAllChecked: boolean = false;
  invoice! : Invoice;

  constructor(private invoiceService: InvoiceService,
    private router: Router,
    private dialogService: DialogService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadInvoices(0,10);
  }

  loadInvoices(page: number, size: number): void {
    this.invoiceService.getAllQuotes(page, size).subscribe(
      (pageResponse) => {
        this.invoicesDataSource = new MatTableDataSource(pageResponse.content);
        this.paginator.length = pageResponse.totalElements;
        this.invoicesDataSource.sort = this.sort;
        this.showCheckbox = pageResponse.totalElements > 0;
      },
      (error) => {
        console.error('Error loading invoices:', error);
      }
    );
  }

  viewInvoice(invoiceId: number) {
    this.router.navigate(['/invoice', invoiceId]);
  }

  onDeleteInvoice(selectedRows: Invoice[]): void {
    const currentPageIndex = this.paginator.pageIndex;
    const currentPageSize = this.paginator.pageSize;
    const confirmationMessage = `Voulez-vous vraiment supprimer ${selectedRows.length > 1 ? 'ces devis' : 'ce devis'} ?`;
  
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
                const message = selectedRows.length > 1 ? 'Les devis ont été supprimés avec succès.' : 'Le devis a été supprimé avec succès.';
                this.snackbarService.openSnackBar(message, 'Fermer');

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

  onPageChange(event: PageEvent): void {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    this.loadInvoices(pageIndex, pageSize);
  }
}

