import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormControl} from '@angular/forms';
import { Observable, tap, filter, Subject, of} from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, exhaustMap, scan, startWith, takeWhile} from 'rxjs/operators';
import { Page } from '../models/page';
import { Customer } from '../models/customer';
import { Product } from '../models/product';
import {Invoice} from '../models/invoice';
import { SettingsResponse } from '../models/settings-response';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

import { CustomerService } from '../services/customer.service';
import { ProductService } from '../services/product.service';
import { InvoiceService } from '../services/invoice.service';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { PdfService } from '../services/pdf.service';

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
  totalAmount =0;
  stamp: number =0;
  selectedDate!: Date;
  productInputIsValid: boolean = false;
  isUpdateMode: boolean = false;
  invoiceId!: number | null;
  hasProductInInvoice: boolean = false;
  isCustomerSelected: boolean = false;
  isSaving = false;
  constructor(
    private customerService: CustomerService,
    private productService: ProductService,
    private invoiceService: InvoiceService,
    private userService: UserService,
    private pdfService: PdfService,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService
    ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);
    this.invoiceId = id ? +id : null; 

    if (this.invoiceId) {
      this.getInvoiceDetails(this.invoiceId);
      this.isUpdateMode=true;
      this.hasProductInInvoice=true;
      this.isCustomerSelected=true;
    }

    this.userService.getUserSettings().subscribe(
      (settingsResponse: SettingsResponse) => {
        this.stamp =settingsResponse.stamp || 0;
      },
      (error) => {
        console.error('Failed to retrieve user settings:', error);
      }
    );
  
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

getInvoiceDetails(id: number) {
  this.invoiceService.getInvoiceById(id).subscribe(
    (invoice: Invoice) => {
      this.customerSearchControl.setValue(invoice.customer);
      this.selectedDate = invoice.dateIssued;

      invoice.lineItems.forEach((item) => {
       const discountAmount = parseFloat(((item.subtotal * item.discountPercentage) / 100).toFixed(3));
       const totalPriceAfterDiscountHT = item.subtotal - discountAmount;
       const taxAmount = parseFloat(((totalPriceAfterDiscountHT * item.tax) / 100).toFixed(3));
       const totalPriceAfterDiscountTTC = parseFloat((totalPriceAfterDiscountHT + taxAmount).toFixed(3));
       item.product.sellingPrice = item.unitPrice;
       item.product.tax = item.tax;
        const newDataItem = {
          id: item.id,
          product: item.product,
          quantity: item.quantity,
          unitPrice: item.product.sellingPrice,
          discountPercentage: item.discountPercentage,
          discountAmount: discountAmount.toFixed(3),
          totalPriceAfterDiscountHT: totalPriceAfterDiscountHT.toFixed(3),
          taxAmount: taxAmount.toFixed(3),
          tax: item.product.tax,
          subtotal: item.subtotal,
          totalPriceAfterDiscountTTC: totalPriceAfterDiscountTTC.toFixed(3)
        };
        this.dataSource.data.push(newDataItem);
      });

      this.dataSource._updateChangeSubscription();
      this.calculateTotals();
    },
    (error) => {
      console.error('Error fetching invoice details:', error);
    }
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
    
      if (productExists && !this.selected) {
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

    this.calculateTotals();

    this.productSearchControl.reset();
    this.quantityControl.setValue(1);
    this.discountPercentageControl.setValue(0);
    this.productInputIsValid =false;
    this.hasProductInInvoice = true;
    this.snackbarService.openSnackBar('L\'article a été ajouté à la facture.', 'Fermer');
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

      this.calculateTotals();
      this.snackbarService.openSnackBar('La ligne de l\'article a été mise à jour.', 'Fermer');
    }
  }

  deleteProduct() {
    const selectedItemIndex = this.dataSource.data.findIndex(item => item.selected);
  
    if (selectedItemIndex !== -1) {

      this.dataSource.data.splice(selectedItemIndex, 1);
      
      this.dataSource._updateChangeSubscription();
      this.calculateTotals();
      this.productSearchControl.reset();
      this.quantityControl.setValue(1);
      this.discountPercentageControl.setValue(0);
      this.selected=false;
      this.hasProductInInvoice = this.dataSource.data.length > 0;
    }
    this.snackbarService.openSnackBar('Article retiré de la facture.', 'Fermer');
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

  calculateTotals() {
    const totalHT = this.dataSource.data.reduce((acc, item) => {
      return acc + parseFloat(item.subtotal);
    }, 0);
    this.totalHT = totalHT.toFixed(3);
  
    const totalDiscount = this.dataSource.data.reduce((acc, item) => {
      return acc + parseFloat(item.discountAmount);
    }, 0);
  
    this.totalDiscount = totalDiscount.toFixed(3);
  
    const totalTTC = this.dataSource.data.reduce((acc, item) => {
      return acc + parseFloat(item.totalPriceAfterDiscountTTC);
    }, 0);
    this.total = totalTTC.toFixed(3);
    this.totalAmount = (totalTTC + this.stamp).toFixed(3);
  }
  
  checkCustomerExists() {
    setTimeout(() => {
    const enteredValue = this.customerSearchControl.value;
    if (enteredValue && enteredValue.id) {
      this.isCustomerSelected = true;
    }
    if (typeof enteredValue === 'string' && enteredValue.trim().length > 0) {
      this.customerService.findSingleCustomer(enteredValue).subscribe(
        (customer) => {
          if (customer) {
            this.customerSearchControl.setValue(customer);
    this.isCustomerSelected = true;
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

  onCustomerInputFocus() {
    this.isCustomerSelected = false;
  }
  
  saveInvoice(): void {
    this.isSaving = true;
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
      totalAmount: this.totalAmount,
      status: 'paid',
      stamp: this.stamp,
      customer: customerIdOnly,
      lineItems: lineItems,
    };
    this.invoiceService.createInvoice(invoiceData)
      .subscribe(
        (createdInvoice) => {
          this.isUpdateMode=true;
          this.updateDataSourceWithInvoiceItems(createdInvoice);
          if (createdInvoice.id !== undefined) {
            this.invoiceId = createdInvoice.id;
          }
          this.isSaving = false;
          this.snackbarService.openSnackBar('La facture a été enregistrée.', 'Fermer');
        },
        (error) => {
          this.isSaving = false;
        }
      );
  }

  updateInvoice() {
    const dueDateString = '2023-12-16T00:00:00Z'; // for testing purpose
    const customer = this.customerSearchControl.value;
    const customerIdOnly = Customer.createWithId(customer.id);
    const lineItems = this.dataSource.data.map(item => {
      const productId = item.product.id;
      const productIdOnly = Product.createWithId(productId);
  
      const lineItem = {
        id: item.id,
        product: productIdOnly,
        quantity: item.quantity,
        unitPrice: item.product.sellingPrice,
        discountPercentage: item.discountPercentage,
        tax: item.product.tax,
        subtotal: item.subtotal,
      };
      return lineItem;
    });
    if (this.invoiceId) {
    const updatedInvoiceData: Invoice = {
      id: this.invoiceId,
      dateIssued: this.selectedDate,
      dueDate: new Date(dueDateString),
      totalAmount: this.totalAmount,
      status: 'payé',
      stamp: this.stamp,
      customer: customerIdOnly,
      lineItems: lineItems,
    };
    this.invoiceService.updateInvoice(this.invoiceId, updatedInvoiceData)
    .subscribe(
      (invoice) => {
        if (invoice && invoice.lineItems) {
          this.updateDataSourceWithInvoiceItems(invoice);
        }
        this.snackbarService.openSnackBar('La facture a été mise à jour.', 'Fermer');
      },
      (error) => {
        console.error('Error updating invoice:', error);
      }
    );  
  }
}

updateDataSourceWithInvoiceItems(invoice: Invoice): void {
  const dataSourceItems = this.dataSource.data;

  invoice.lineItems.forEach(updatedLineItem => {
    const index = dataSourceItems.findIndex(item => item.product.id === updatedLineItem.product.id && !item.id);
    if (index !== -1) {
      dataSourceItems[index].id = updatedLineItem.id;
    }
  });

  this.dataSource.data = dataSourceItems;
}
 
generateInvoicePdf(invoiceId: number): void {
  this.pdfService.generateInvoicePdf(invoiceId).subscribe(
    (response: any) => {
      const blob = new Blob([response.body], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    },
    (error: any) => {
      console.error('Error generating PDF: ', error);
      // Handle error, show error message, etc.
    }
  );
}
}
