import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../models/invoice';
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private baseUrl = 'http://localhost:8080/api/invoices';

  constructor(private http: HttpClient) { }

  getAllInvoices(page: number, size: number): Observable<Page<any>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<any>>(`${this.baseUrl}`,{ params });
  }

  getAllQuotes(page: number, size: number): Observable<Page<any>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<any>>(`${this.baseUrl}`,{ params });
  }

  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.baseUrl}/${id}`);
  }

  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.baseUrl}`, invoice);
  }

  updateInvoice(id: number, invoice: Invoice): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.baseUrl}/${id}`, invoice);
  }

  deleteInvoice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
