export interface OrderPlaceRequest {
  couponId?: number | null;
  orderItems: { productId: number; quantity: number }[];
}

export interface OrderPlaceResponse {
  orderId: number;
  totalAmount: number;
  discountAmount: number;
}

export interface OrderItemDto {
  productId: number;
  quantity: number;
}
