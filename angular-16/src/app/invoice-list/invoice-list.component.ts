import { Component, OnInit } from '@angular/core';
import { Invoice } from '../models/invoice';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'invoiceNumber',
    'customer',
    'date',
    'totalAmount',
    'state',
    'action',
  ];
  invoices: Invoice[] = [];

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.invoiceService.getAllInvoices().subscribe(
      (invoices) => {
        this.invoices = invoices;
      },
      (error) => {
        console.error('Error loading invoices:', error);
      }
    );
  }
}
