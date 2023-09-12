export class Product {
    id: number;
    name: string;
    description: string;
    unitPrice: number;
  
    constructor(id: number, name: string, description: string, unitPrice: number) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.unitPrice = unitPrice;
    }
  }
  