import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { Page } from '../models/page';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = environment.apiUrl.products;

  constructor(private http: HttpClient) {}

  getAllProducts(page: number, size: number): Observable<Page<any>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  
    return this.http.get<Page<any>>(`${this.apiUrl}`, { params });
  }
  
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}`, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchProductsByPrefix(prefix: string, page: number, size: number): Observable<Page<Product>> {
    const params = new HttpParams()
      .set('prefix', prefix)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Product>>(`${this.apiUrl}/search`, { params });
  }
}
