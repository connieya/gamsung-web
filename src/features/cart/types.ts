export interface CartItem {
  itemId?: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal?: number;
}

export interface Cart {
  cartId?: number;
  items: CartItem[];
  totalAmount: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateQuantityRequest {
  quantity: number;
}
