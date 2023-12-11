import { Component, OnInit, ViewChild } from '@angular/core';
import { Invoice } from '../models/invoice';
import { InvoiceService } from '../services/invoice.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-quote-list',
  templateUrl: './quote-list.component.html',
  styleUrls: ['./quote-list.component.scss']
})
export class QuoteListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  invoicesDataSource = new MatTableDataSource<Invoice>();
  displayedColumns: string[] = [
    'select',
    'invoiceNumber',
    'customer',
    'date',
    'totalAmount',
    'state',
    'action',
  ];

  constructor(private invoiceService: InvoiceService) {}

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
}

