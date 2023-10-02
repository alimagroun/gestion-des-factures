import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../models/page'; 
import { Customer } from '../models/customer'; 
import { CustomerCreationRequest } from '../models/customer-creation-request';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly apiUrl = 'http://localhost:8080/api/customers';

  constructor(private http: HttpClient) {}

  createCustomer1(customerRequest: CustomerCreationRequest): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}`, customerRequest);
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}`, customer);
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
}
