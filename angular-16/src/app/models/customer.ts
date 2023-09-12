export class Customer {
    id: number | undefined;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
//  invoices: Invoice[] | undefined;
  
    constructor(
      firstName: string,
      lastName: string,
      email: string,
      phoneNumber: string
    ) {
      this.id = undefined; 
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.phoneNumber = phoneNumber;
  //  this.invoices = undefined; 
    }
  }
  