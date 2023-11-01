import { Component, ViewChild, ElementRef, HostListener,OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { Observable, tap, filter, Subject, of  } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, exhaustMap, scan, startWith, takeWhile} from 'rxjs/operators';
import { takeWhileInclusive } from 'rxjs-take-while-inclusive';
import { Page } from '../models/page';
import { Customer } from '../models/customer';
import { Product } from '../models/product';


import { CustomerService } from '../services/customer.service';
import { ProductService } from '../services/product.service';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatInput } from '@angular/material/input';

export interface StudentsClass {
  id: number;
  name: string;
}

@Component({
  selector: 'app-invoice-create',
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.scss']
})
export class InvoiceCreateComponent implements OnInit, OnDestroy  {
  customerSearchControl = new FormControl();
  productSearchControl = new FormControl();
  customers$!: Observable<Customer[]>;
  products$!: Observable<Page<Product>>;
  minSearchLength = 3;
  productPage = 0;
  searchText = new FormControl();
  filteredProducts$!: Observable<Product[]>;
  private nextPage$ = new Subject();
  private _onDestroy = new Subject();

  constructor(
    private customerService: CustomerService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    ) {}

  ngOnInit() {
    this.customers$ = this.customerSearchControl.valueChanges
      .pipe(
        debounceTime(800),
        filter(prefix => typeof prefix === 'string'),
        filter(prefix => prefix.length >= this.minSearchLength),
        distinctUntilChanged(),
        tap(prefix => console.log('Prefix:', prefix)),
        switchMap(prefix => this.customerService.searchCustomersByPrefix(prefix))
      );

      const filter$ = this.searchText.valueChanges.pipe(
        debounceTime(800),
        filter(prefix => typeof prefix === 'string'),
        filter(prefix => prefix.length >= this.minSearchLength),
        distinctUntilChanged(),
        switchMap((q) => (typeof q === 'string' ? of(q) : of('')))
      );


      this.filteredProducts$ = filter$.pipe(
        switchMap((filter) => {

          let currentPage = 0;
          return this.nextPage$.pipe(
            startWith(currentPage),
     
            exhaustMap((_) => this.searchProducts(filter, currentPage)),
            tap(() => currentPage++),
   
            takeWhile((p) => p.length > 0),
            scan((allProducts, newProducts) => allProducts.concat(newProducts), [] as Product[])
          );
        })
      ); 



      this.products$ = this.productSearchControl.valueChanges
      .pipe(
        debounceTime(800),
        filter(prefix => typeof prefix === 'string'),
        filter(prefix => prefix.length >= this.minSearchLength),
        distinctUntilChanged(),
        tap(prefix => console.log('Product Prefix:', prefix)),
        switchMap(prefix => this.productService.searchProductsByPrefix(prefix, 0, 10)) // Adjust page and size as needed
      ); 
  
    this.customers$.subscribe(data => {
      console.log('Received data from the backend:', data);
    });


  }

  displayCustomerFn(customer: Customer): string {
    return customer ? `${customer.firstName} ${customer.lastName}` : '';
  }

  displayProductFn(product: Product): string {
    return product ? product.designation : '';
  }

  private searchProducts(prefix: string, page: number): Observable<Product[]> {
 
    return this.productService
      .searchProductsByPrefix(prefix, page, 10)
      .pipe(
        map((response: Page<Product>) => {
          if (response && response.content) {
            return response.content;
          } else {
            return [];
          }
        })
      );
  }

  displayWith(product: Product | null): string {
   
    if (!product) {
      return '';
    }
    return product.designation;
  }

  onScroll() {

    this.nextPage$.next(null);
  }

  ngOnDestroy() {
    console.log('inside ngOnDestroy');
    this._onDestroy.next(null);
    this._onDestroy.complete();
  }

}
