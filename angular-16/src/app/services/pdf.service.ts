import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private baseUrl = 'http://localhost:8080'; // Replace this with your backend URL

  constructor(private http: HttpClient) { }

  generateInvoicePdf(invoiceId: number): Observable<HttpResponse<Blob>> {
    const url = `${this.baseUrl}/api/pdf/generate-invoice/${invoiceId}`;
    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/pdf'
      })
    });
  }
}
