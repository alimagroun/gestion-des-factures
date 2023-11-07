import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl} from '@angular/forms';
import { Observable, tap, filter, Subject, of  } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, exhaustMap, scan, startWith, takeWhile} from 'rxjs/operators';
import { Page } from '../models/page';
import { Customer } from '../models/customer';
import { Product } from '../models/product';
import { LineItem } from '../models/lineItem';
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
  quantityControl = new FormControl(1);
  discountPercentageControl = new FormControl(0);
  customers$!: Observable<Customer[]>;
  filteredProducts$!: Observable<Product[]>;
  minSearchLength = 3;
  private nextPage$ = new Subject();
  private _onDestroy = new Subject();
  displayedColumns: string[] = [
    'select',
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
  dataSource = new MatTableDataSource<any>([]);
  selected: boolean = false;
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

  handleInputBlur(): void {
    const enteredValue = this.productSearchControl.value;

    if (enteredValue.trim().length > 0) {
      this.checkProductValidity();
    }
  }
  
  checkProductValidity(): void {
    const enteredProduct = this.productSearchControl.value;
  
    this.productService.findProductIdByDesignation(enteredProduct).subscribe(
      (product) => {
        if (product !== null) {
          this.productSearchControl.setValue(product);
        } else {
          console.log("Product not found.");
          this.productSearchControl.setErrors({ 'productNotFound': true });
        }
      },
      (error) => {
        console.error('An error occurred while checking product validity:', error);
      }
    );
  }
  
    
  formatPercentage(event: any): void {
    const inputElement = event.target as HTMLInputElement;
    const selectionStart = inputElement.selectionStart;
    const selectionEnd = inputElement.selectionEnd;
  
    let inputValue = inputElement.value;
  
    inputValue = inputValue.replace(/[^0-9.]/g, '');
    
    const parts = inputValue.split('.');
  
    if (parts[0] && parts[0].length > 2) {
      parts[0] = parts[0].slice(0, 2);
    }
  
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].slice(0, 2);
    }
  
    inputValue = parts.join('.');
  
    const dotCount = inputValue.split('.').length - 1;
    if (dotCount > 1) {
      const indexOfLastDot = inputValue.lastIndexOf('.');
      inputValue = inputValue.substring(0, indexOfLastDot) + inputValue.substring(indexOfLastDot + 1);
    }

    this.discountPercentageControl.setValue(parseFloat(inputValue));
  
    inputElement.value = inputValue;
  }

  addProduct() {
    const selectedProduct = this.productSearchControl.value;
    const selectedQuantity = this.quantityControl.value!;
    const discountPercentage = this.discountPercentageControl.value!;
  
    const subtotal = parseFloat((selectedProduct.sellingPrice * selectedQuantity).toFixed(3));
    const discountAmount = parseFloat(((subtotal * discountPercentage) / 100).toFixed(3));
    const totalPriceAfterDiscountHT = subtotal - discountAmount;
    const taxAmount = parseFloat(((totalPriceAfterDiscountHT * selectedProduct.tax) / 100).toFixed(3));
    const totalPriceAfterDiscountTTC = parseFloat((totalPriceAfterDiscountHT + taxAmount).toFixed(3));

    const lineItem = {
      product: selectedProduct,
      quantity: selectedQuantity,
      subtotal: subtotal.toFixed(3),
      discountPercentage: discountPercentage,
      discountAmount: discountAmount.toFixed(3),
      totalPriceAfterDiscountHT: totalPriceAfterDiscountHT.toFixed(3),
      taxAmount: taxAmount.toFixed(3),
      totalPriceAfterDiscountTTC: totalPriceAfterDiscountTTC.toFixed(3),
      selected: false
    };
    
    this.dataSource.data.push(lineItem);
    this.dataSource._updateChangeSubscription();

    this.productSearchControl.reset();
    this.quantityControl.setValue(1);
    this.discountPercentageControl.setValue(0);    
  }

  updateProduct() {
    const selectedProduct = this.productSearchControl.value;
    const selectedQuantity = this.quantityControl.value;
    const discountPercentage = this.discountPercentageControl.value;

    const selectedItem = this.dataSource.data.find(item => item.selected);
  
    if (selectedItem) {
      const subtotal = parseFloat((selectedProduct.sellingPrice * selectedQuantity!).toFixed(3));
      const discountAmount = parseFloat(((subtotal * discountPercentage!) / 100).toFixed(3));
      const totalPriceAfterDiscountHT = subtotal - discountAmount;
      const taxAmount = parseFloat(((totalPriceAfterDiscountHT * selectedProduct.tax) / 100).toFixed(3));
      const totalPriceAfterDiscountTTC = parseFloat((totalPriceAfterDiscountHT + taxAmount).toFixed(3));
  
      selectedItem.product = selectedProduct;
      selectedItem.quantity = selectedQuantity;
      selectedItem.discountPercentage = discountPercentage;
      selectedItem.subtotal = subtotal.toFixed(3);
      selectedItem.discountAmount = discountAmount.toFixed(3);
      selectedItem.totalPriceAfterDiscountHT = totalPriceAfterDiscountHT.toFixed(3);
      selectedItem.taxAmount = taxAmount.toFixed(3);
      selectedItem.totalPriceAfterDiscountTTC = totalPriceAfterDiscountTTC.toFixed(3);
  
    }
  }

  deleteProduct() {
    const selectedItemIndex = this.dataSource.data.findIndex(item => item.selected);
  
    if (selectedItemIndex !== -1) {

      this.dataSource.data.splice(selectedItemIndex, 1);
      
      this.dataSource._updateChangeSubscription();
      this.productSearchControl.reset();
      this.quantityControl.setValue(1);
      this.discountPercentageControl.setValue(0);
      this.selected=false;
    }
  }
  
  onProductSelected(item: any, checkbox: any) {
    this.dataSource.data.forEach(dataItem => {
      if (dataItem !== item) {
        dataItem.selected = false;
      }
    });
  
    item.selected = checkbox.checked;
  
    if (checkbox.checked) {
      this.productSearchControl.setValue(item.product);
      this.quantityControl.setValue(item.quantity);
      this.discountPercentageControl.setValue(item.discountPercentage);
      this.selected=true;
    } else {
      this.productSearchControl.reset();
      this.quantityControl.setValue(1);
      this.discountPercentageControl.setValue(0);
      this.selected=false;
    }
  }
  
}
