import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject, of, map, filter } from 'rxjs';
import {
  debounceTime,
  switchMap,
  tap,
  takeWhile,
  scan,
  exhaustMap,
  startWith,
  takeUntil,
} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { Page } from '../models/page';

@Component({
  selector: 'app-quote-create',
  templateUrl: './quote-create.component.html',
  styleUrls: ['./quote-create.component.scss'],
})
export class QuoteCreateComponent implements OnInit, OnDestroy {
  searchText = new FormControl();
  filteredProducts$!: Observable<Product[]>;
  private nextPage$ = new Subject();
  private _onDestroy = new Subject();
  minSearchLength = 3;

  constructor(private productService: ProductService) {} 

  ngOnInit() {
  const filter$ = this.searchText.valueChanges.pipe(
    startWith(''),
    debounceTime(200),
    filter((q) => typeof q === 'string' && q.length >= this.minSearchLength),
    switchMap((q) => (typeof q === 'string' ? of(q) : of(''))
  ));

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
}
