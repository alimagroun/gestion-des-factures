export class Product {
  id: number;
  reference: string;
  designation: string;
  purchasePrice: number;
  sellingPrice: number;
  profitMargin: number;
  tax: number;
  lastUpdate: Date;

  constructor(
    id: number,
    reference: string,
    designation: string,
    purchasePrice: number,
    sellingPrice: number,
    profitMargin: number,
    tax: number,
    lastUpdate: Date
  ) {
    this.id = id;
    this.reference = reference;
    this.designation = designation;
    this.purchasePrice = purchasePrice;
    this.sellingPrice = sellingPrice;
    this.profitMargin = profitMargin;
    this.tax = tax;
    this.lastUpdate = lastUpdate;
  }
}
