import { Address } from './address';

export class Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  taxIdentificationNumber: string;
  address?: Address;

  constructor(
    firstName: string = '',
    lastName: string = '',
    email: string = '',
    phoneNumber: string = '',
    companyName: string = '',
    taxIdentificationNumber: string = '',
    address: Address | undefined = undefined
  ) {
    this.id = 0;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.companyName = companyName;
    this.taxIdentificationNumber = taxIdentificationNumber;
    this.address = address;
  }

  static createWithId(id: number): Customer {
    const customer = new Customer();
    customer.id = id;
    return customer;
  }
  
}
