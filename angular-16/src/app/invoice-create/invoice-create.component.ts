import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl} from '@angular/forms';
import { Observable, tap, filter, Subject, of  } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, exhaustMap, scan, startWith, takeWhile} from 'rxjs/operators';
import { Page } from '../models/page';
import { Customer } from '../models/customer';
import { Product } from '../models/product';
import { MatTableDataSource } from '@angular/material/table';

import { CustomerService } from '../services/customer.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-invoice-create',
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.scss']
})
export class InvoiceCreateComponent implements OnInit, OnDestroy  {
  customerSearchControl = new FormControl();
  productSearchControl = new FormControl();
  quantityControl = new FormControl();
  customers$!: Observable<Customer[]>;
  filteredProducts$!: Observable<Product[]>;
  minSearchLength = 3;
  private nextPage$ = new Subject();
  private _onDestroy = new Subject();
  displayedColumns: string[] = [
    'reference',
    'designation',
    'quantity',
    'unitPriceHT',
    'totalPriceHT',
    'discountPercentage',
    'discountAmount',
    'totalPriceAfterDiscountHT',
    'taxPercentage',
    'taxAmount',
    'totalPriceAfterDiscountTTC'
  ];
  dataSource!: MatTableDataSource<any>;


  constructor(
    private customerService: CustomerService,
    private productService: ProductService,
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

      const filter$ = this.productSearchControl.valueChanges.pipe(
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
  }

  displayCustomerFn(customer: Customer): string {
    return customer ? `${customer.firstName} ${customer.lastName}` : '';
  }

  displayProductFn(product: Product | null): string {
    if (!product) {
      return '';
    }
    return product.designation;
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

  onScroll() {

    this.nextPage$.next(null);
  }

  ngOnDestroy() {
    console.log('inside ngOnDestroy');
    this._onDestroy.next(null);
    this._onDestroy.complete();
  }

  addProduct(){}

  handleInputBlur(): void {
    const enteredValue = this.productSearchControl.value;

    if (enteredValue.trim().length > 0) {
      this.checkProductValidity();
    }
  }
  
checkProductValidity(): void {
  const enteredProduct = this.productSearchControl.value;

    console.log('Left the input field without selecting an existing product.');
  
}

}
