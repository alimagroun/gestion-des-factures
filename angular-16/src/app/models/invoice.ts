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
  customer: Customer;
  lineItems: LineItem[];
  quote?: boolean;

  constructor(
    id: number,
  //  invoiceNumber: string,
    dateIssued: Date,
    dueDate: Date,
    totalAmount: number,
    status: string,
    stamp: number,
    customer: Customer,
    lineItems: LineItem[],
    quote: boolean,
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
    this.quote = quote;
  }

  
}
