export type OrderStatus = "INIT" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface OrderSummary {
  orderId: number;
  orderNumber: string;
  orderStatus: OrderStatus;
  totalAmount: number;
  createdAt: string;
}

export interface OrderDetail {
  orderId: number;
  orderNumber: string;
  totalAmount: number;
  discountAmount: number;
  orderStatus: OrderStatus;
  createdAt: string;
  items: OrderLineItem[];
}

export interface OrderLineItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface OrderListResponse {
  orders: OrderSummary[];
}

// Legacy types (keep for backward compatibility)
export interface OrderPlaceRequest {
  orderNo?: string;
  couponId?: number | null;
  orderItems: { productId: number; quantity: number }[];
}

export interface OrderPlaceResponse {
  orderId: number;
  totalAmount: number;
  discountAmount: number;
  orderNo?: string;
}

export interface OrderIssueOrderNoRequest {
  isNewOrderForm: boolean;
}

export interface OrderIssueOrderNoResponse {
  orderNo: string;
  orderSignature: string;
  timestamp: number;
  orderVerifyKey: string;
  orderKey: string;
}

export interface OrderItemDto {
  productId: number;
  quantity: number;
}
