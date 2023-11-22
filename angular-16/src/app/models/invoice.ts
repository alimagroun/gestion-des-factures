import { Customer } from './customer';
import { LineItem } from './lineItem';

export class Invoice {
  id?: number;
  invoiceNumber?: string;
  dateIssued: Date;
  dueDate: Date;
  totalAmount: number;
  status: string;
  stamp: number;
  customer: Customer; // Use the Customer model
  lineItems: LineItem[]; // Use the LineItem model

  constructor(
    id: number,
  //  invoiceNumber: string,
    dateIssued: Date,
    dueDate: Date,
    totalAmount: number,
    status: string,
    stamp: number,
    customer: Customer,
    lineItems: LineItem[]
  ) {
    this.id = id;
 //   this.invoiceNumber = invoiceNumber;
    this.dateIssued = dateIssued;
    this.dueDate = dueDate;
    this.totalAmount = totalAmount;
    this.status = status;
    this.stamp = stamp;
    this.customer = customer;
    this.lineItems = lineItems;
  }
}
