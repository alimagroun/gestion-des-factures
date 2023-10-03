export class Address {
    id: number; 
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
  
    constructor(
      id: number,
      streetAddress: string,
      city: string,
      state: string,
      postalCode: string
    ) {
      this.id = id;
      this.streetAddress = streetAddress;
      this.city = city;
      this.state = state;
      this.postalCode = postalCode;
    }
  }
  