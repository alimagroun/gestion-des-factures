import { Component, OnInit, ViewChild } from '@angular/core'; import { CustomerService } from '../services/customer.service';
import { Page } from '../models/page';
import { Customer } from '../models/customer';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CustomerCreateModalComponent } from '../customer-create-modal/customer-create-modal.component';
import { CustomerEditModalComponent } from '../customer-edit-modal/customer-edit-modal.component';
import { DialogService } from '../services/DialogService';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {
  dataSource!: MatTableDataSource<any>;
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
    const dialogRef = this.dialog.open(CustomerEditModalComponent, {
      width: 'auto',
      data: customer,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadCustomers(this.paginator.pageIndex, this.paginator.pageSize);
        this.showModifierButton = false;
        this.showSupprimerButton = false;
      }
    });
  }

  onDeleteCustomer(selectedRows: Customer[]): void {
    const currentPageIndex = this.paginator.pageIndex;
    const currentPageSize = this.paginator.pageSize;
    const confirmationMessage = `Voulez-vous vraiment supprimer ${
      selectedRows.length > 1 ? 'ces clients' : 'ce client'
    } ?`;
  
    this.dialogService
      .openDeleteConfirmationDialog(confirmationMessage)
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          selectedRows.forEach((customer, index) => {
            const customerId = customer.id; // This may be a number or undefined
            if (customerId !== undefined) {
              // Use customerId as a valid number
              this.customerService.deleteCustomer(customerId).subscribe(
                () => {
                  this.dataSource.data = this.dataSource.data.filter(
                    (item) => item.id !== customer.id
                  );
  
                  const totalCustomersCount = this.dataSource.data.length;
  
                  if (totalCustomersCount === 0) {
                    if (currentPageIndex > 0) {
                      this.paginator.pageIndex = currentPageIndex - 1;
                    } else {
                      this.paginator.pageIndex = 0;
                    }
                  }
  
                  this.loadCustomers(this.paginator.pageIndex, currentPageSize);
                  this.selectAllChecked = false;
                },
                (error) => {
                  console.error(`Error deleting customer ${customerId}:`, error);
                }
              );
            } else {
              console.error('Customer ID is undefined');
            }
          });
        } else {
          console.log('Delete canceled');
        }
      });
  }

  selectAllRows(event: any) {
    this.showModifierButton = false;
    this.showSupprimerButton = event.checked;
  
    this.selectedRows = [];
  
    if (event.checked) {
      this.dataSource.data.forEach((item) => {
        item.isSelected = true;
        this.selectedRows.push(item);
      });
    } else {
      this.dataSource.data.forEach((item) => (item.isSelected = false));
    }
  }

  selectRow(row: Customer) {
  
    this.selectedRows = this.dataSource.data.filter((item) => item.isSelected);
  
    if (this.selectedRows.length === 1) {
      this.customer = this.selectedRows[0];
      this.showModifierButton = true;
    } else {
      this.customer = new Customer();
      this.showModifierButton = false;
    }
  
    this.showSupprimerButton = this.selectedRows.length > 0;
  
    const allCustomersSelected = this.dataSource.data.every((item) => item.isSelected);
    this.selectAllChecked = allCustomersSelected;
  }
  
}
