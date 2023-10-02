import { Component, OnInit, ViewChild } from '@angular/core'; import { CustomerService } from '../services/customer.service';
import { Page } from '../models/page';
import { Customer } from '../models/customer';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CustomerCreateModalComponent } from '../customer-create-modal/customer-create-modal.component';
// import { CustomerEditModalComponent } from '../customer-edit-modal/customer-edit-modal.component';
import { DialogService } from '../services/DialogService';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {
  dataSource!: MatTableDataSource<Customer>;
  displayedColumns: string[] = [
    'select',
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
  ];
  showModifierButton: boolean = false;
  showSupprimerButton: boolean = false;
  selectAllChecked: boolean = false;
  customer!: Customer;
  selectedRows: Customer[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadCustomers(0, 10);
  }

  loadCustomers(page: number, size: number): void {
    this.customerService.getAllCustomers(page, size).subscribe(
      (data: Page<Customer>) => {
        this.dataSource = new MatTableDataSource(data.content);
        this.paginator.length = data.totalElements;
      },
      (error) => {
        console.error('Error loading customers:', error);
      }
    );
  }

  onPageChange(event: any): void {
    this.selectAllChecked = false;
    this.showModifierButton = false;
    this.showSupprimerButton = false;
    const page = event.pageIndex;
    const size = event.pageSize;
    this.loadCustomers(page, size);
  }

  openCreateCustomerModal(): void {
    const dialogRef = this.dialog.open(CustomerCreateModalComponent, {
      width: 'auto',
    });

    
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === true) {
        this.loadCustomers(this.paginator.pageIndex, this.paginator.pageSize);
      }
    });
  }

  openEditCustomerModal(customer: Customer): void {
   // const dialogRef = this.dialog.open(CustomerEditModalComponent, {
   //   width: 'auto',
   //   data: customer,
   // });

  //  dialogRef.afterClosed().subscribe((result) => {
  //    if (result === true) {
  //      this.loadCustomers(this.paginator.pageIndex, this.paginator.pageSize);
  //    }
  //  });
  }

  onDeleteCustomer(selectedRows: Customer[]): void {
    // Implement delete logic here, similar to what you did for products
  }

  selectAllRows(event: any) {
    // Implement select all logic here
  }

  selectRow(row: Customer) {
    // Implement select row logic here
  }
}
