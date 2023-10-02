export interface CustomerCreationRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  }
  