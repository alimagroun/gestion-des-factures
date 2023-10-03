export interface CustomerCreationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName?: string;
  taxIdentificationNumber?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}
