import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl} from '@angular/forms';
import { Observable, tap, filter, Subject, of  } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, exhaustMap, scan, startWith, takeWhile} from 'rxjs/operators';
import { Page } from '../models/page';
import { Customer } from '../models/customer';
import { Product } from '../models/product';
import { LineItem } from '../models/lineItem';
import {Invoice} from '../models/invoice';
import { MatTableDataSource } from '@angular/material/table';

import { CustomerService } from '../services/customer.service';
import { ProductService } from '../services/product.service';
import { InvoiceService } from '../services/invoice.service';

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
  totalHT = 0;
  totalDiscount =0;
  total = 0;
  selectedDate!: Date;
  productInputIsValid: boolean = false;
  constructor(
    private customerService: CustomerService,
    private productService: ProductService,
    private invoiceService: InvoiceService
    ) {}

  ngOnInit() {
    this.selectedDate = new Date();

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
    if (customer) {
      if (customer.companyName && customer.companyName.trim() !== '') {
        return customer.companyName;
      } else {
        return `${customer.firstName} ${customer.lastName}`;
      }
    }
    return '';
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

  onProductInputFocus() {
    this.productInputIsValid = false;
  }
  
  validateProductExistence(): void {
    const enteredValue = this.productSearchControl.value;
  
    setTimeout(() => {
      const enteredValue = this.productSearchControl.value;
      if (typeof enteredValue === 'string' && enteredValue.trim().length > 0) {
        this.checkProductValidity();
      }
    }, 100);

    if (enteredValue && enteredValue.id !== undefined) {
      this.productInputIsValid =true;
      const productExists = this.dataSource.data.some(item => {
        const lineItemProduct = item.product;
        return lineItemProduct && lineItemProduct.id === enteredValue.id;
      });
    
      if (productExists) {
        this.productInputIsValid =false;
        this.productSearchControl.setErrors({
          'duplicateProduct': true
        });
      }
    }
  }
    
  checkProductValidity(): void {
    const enteredProduct = this.productSearchControl.value;
  
    this.productService.findProductIdByDesignation(enteredProduct).subscribe(
      (product) => {
        if (product !== null) {
          this.productInputIsValid =true;
          this.productSearchControl.setValue(product);
          if(!this.selected){
          const productExists = this.dataSource.data.some(item => {
            const lineItemProduct = item.product;
            return lineItemProduct && lineItemProduct.id === product.id;
          });
        
          if (productExists) {
            this.productInputIsValid =false;
            this.productSearchControl.setErrors({
              'duplicateProduct': true
            });
          }
        }
      }
      },
      (error) => {
        this.productInputIsValid =false;
        this.productSearchControl.setErrors({ 'productNotFound': true });
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

    const totalHT = this.dataSource.data.reduce((acc, item) => {
      return acc + parseFloat(item.subtotal);
    }, 0);
  
    this.totalHT = totalHT.toFixed(3);

    const totalDiscount = this.dataSource.data.reduce((acc, item) => {
      return acc + parseFloat(item.discountAmount);
    }, 0) + discountAmount;
  
    this.totalDiscount = totalDiscount.toFixed(3);

    const totalTTC = this.dataSource.data.reduce((acc, item) => {
      return acc + parseFloat(item.totalPriceAfterDiscountTTC);
    }, 0);
  
    this.total = totalTTC.toFixed(3);
   
    this.productSearchControl.reset();
    this.quantityControl.setValue(1);
    this.discountPercentageControl.setValue(0);
    this.productInputIsValid =false;    
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

      const totalHT = this.dataSource.data.reduce((acc, item) => {
        return acc + parseFloat(item.subtotal);
      }, 0);
    
      this.totalHT = totalHT.toFixed(3);

      const totalDiscount = this.dataSource.data.reduce((acc, item) => {
        return acc + parseFloat(item.discountAmount);
      }, 0) + discountAmount;
    
      this.totalDiscount = totalDiscount.toFixed(3);

      const total = this.dataSource.data.reduce((acc, item) => {
        return acc + parseFloat(item.totalPriceAfterDiscountTTC);
      }, 0);
  
      this.total = total.toFixed(3);
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
  
  checkCustomerExists() {
    setTimeout(() => {
    const enteredValue = this.customerSearchControl.value;
  
    if (typeof enteredValue === 'string' && enteredValue.trim().length > 0) {
      this.customerService.findSingleCustomer(enteredValue).subscribe(
        (customer) => {
          if (customer) {
            this.customerSearchControl.setValue(customer);
            console.log('Customer First Name:', customer.firstName);
          }
        },
        (error) => {
          if (error.status === 404) {
            this.customerSearchControl.setErrors({ 'customerNotFound': true });
          }
        }
      );
    }
  }, 100);
  }
  
  saveInvoice(): void {
    const dueDateString = '2023-12-16T00:00:00Z'; // for testing purpose
    
    const customer = this.customerSearchControl.value;
    const customerIdOnly = Customer.createWithId(customer.id);

    const lineItems = this.dataSource.data.map(item => {
      const productId = item.product.id;
      const productIdOnly = Product.createWithId(productId);
    
      const lineItem = {
        product: productIdOnly,
        quantity: item.quantity,
        unitPrice: item.product.sellingPrice,
        discountPercentage: item.discountPercentage,
        tax: item.product.tax,
        subtotal: item.subtotal,
      };
      return lineItem;
    });
    
    const invoiceData: Invoice = {
      dateIssued: this.selectedDate,
      dueDate: new Date(dueDateString),
      totalAmount: this.total+1,
      status: 'paid', // for testing purpose
      stamp: 1, // for testing purpose
      customer: customerIdOnly,
      lineItems: lineItems
    };
    
    this.invoiceService.createInvoice(invoiceData)
      .subscribe(
        (response) => {
          console.log('Invoice created successfully:', response);
        },
        (error) => {
          console.error('Error creating invoice:', error);
        }
      );
  }
  
}
