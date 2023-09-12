import { Product } from './product';

export class LineItem {
  id: number | undefined;
  product: Product | undefined;
  quantity: number;
  subtotal: number;

  constructor(
    quantity: number,
    subtotal: number,
    id?: number,
    product?: Product
  ) {
    this.id = id;
    this.product = product;
    this.quantity = quantity;
    this.subtotal = subtotal;
  }
}
