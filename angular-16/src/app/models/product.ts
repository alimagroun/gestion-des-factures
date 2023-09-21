export class Product {
  id: number;
  reference: string;
  designation: string;
  purchasePrice: number;
  sellingPrice: number;
  profitMargin: number;
  tax: number;
  lastUpdate: Date;

  constructor() {
    this.id = 0;
    this.reference = '';
    this.designation = '';
    this.purchasePrice = 0;
    this.sellingPrice = 0;
    this.profitMargin = 0;
    this.tax = 0;
    this.lastUpdate = new Date();
  }
  
  
}
