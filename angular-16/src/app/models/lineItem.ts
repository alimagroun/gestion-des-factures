import { Product } from './product';

export class LineItem {
  id?: number;
  product: Product;
  unitPrice: number;
  discountPercentage: number;
  tax: number;
  quantity: number;
  subtotal: number;

  constructor(product: Product, unitPrice: number, discountPercentage: number, tax: number, quantity: number, subtotal: number) {
    this.product = product;
    this.unitPrice = unitPrice;
    this.discountPercentage = discountPercentage;
    this.tax = tax;
    this.quantity = quantity;
    this.subtotal = subtotal;
  }
}
