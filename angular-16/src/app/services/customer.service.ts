import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../models/page'; 
import { Customer } from '../models/customer'; 
import { CustomerCreationRequest } from '../models/customer-creation-request';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly apiUrl = environment.apiUrl.customers;

  constructor(private http: HttpClient) {}

  createCustomer(customerRequest: CustomerCreationRequest): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}`, customerRequest);
  }

  getCustomerById(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${customerId}`);
  }

  getAllCustomers(page: number, size: number): Observable<Page<Customer>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Customer>>(`${this.apiUrl}`, { params });
  }

  updateCustomer(customerId: number, updatedCustomer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${customerId}`, updatedCustomer);
  }

  deleteCustomer(customerId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${customerId}`);
  }

  searchCustomersByPrefix(prefix: string): Observable<Customer[]> {
    const searchUrl = `${this.apiUrl}/search?prefix=${prefix}`;
    return this.http.get<Customer[]>(searchUrl);
  }

  findSingleCustomer(prefix: string): Observable<Customer | null> {
    return this.http.get<Customer | null>(`${this.apiUrl}/findSingleCustomer?prefix=${prefix}`);
  }
}
