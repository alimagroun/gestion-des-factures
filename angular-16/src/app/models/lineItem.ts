import { Product } from './product';

export class LineItem {
  id: number | undefined;
  product: Product | undefined;
  quantity: number;
  subtotal: number;

  constructor(
    quantity: number,
    product: Product,
    subtotal: number
  ) {
    this.product = product;
    this.quantity = quantity;
    this.subtotal = subtotal;
  }
}
