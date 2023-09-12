import { Customer } from './customer';
import { LineItem } from './lineItem'; 

export class Invoice {
//  id: number | undefined;
  invoiceNumber: string;
  dateIssued: Date | undefined;
  dueDate: Date | undefined;
  totalAmount: number;
  status: string;
//  lineItems: LineItem[] | undefined;
//  customer: Customer | undefined;

  constructor(
    invoiceNumber: string,
    totalAmount: number,
    status: string,
 //   id?: number,
    dateIssued?: Date,
    dueDate?: Date,
    lineItems?: LineItem[],
    customer?: Customer
  ) {
 //   this.id = id;
    this.invoiceNumber = invoiceNumber;
    this.dateIssued = dateIssued;
    this.dueDate = dueDate;
    this.totalAmount = totalAmount;
    this.status = status;
//    this.lineItems = lineItems;
//    this.customer = customer;
  }
}
