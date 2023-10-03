import { Address } from './address';

export class Customer {
  id: number | undefined;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: Address | undefined;

  constructor(
    firstName: string = '',
    lastName: string = '',
    email: string = '',
    phoneNumber: string = '',
    address: Address | undefined = undefined
  ) {
    this.id = undefined;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
  }
}
