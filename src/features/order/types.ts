import type { PaymentMethod, PayKind } from "@/features/payment/types";

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

export interface OrderFormResponse {
  member: {
    userId: string;
    email: string;
  };
  cartItems: Array<{
    cartId: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    imageUrl: string;
  }>;
  totalAmount: number;
}

export interface OrderReadyRequest {
  paymentMethod: PaymentMethod;
  payKind?: PayKind;
  orderKey: string;
  orderItems: Array<{
    productId: number;
    quantity: number;
  }>;
  couponId?: number | null;
}

export interface OrderReadyResponse {
  paymentId: number;
  paymentStatus: string;
}

export interface OrderPaymentSessionRequest {
  orderNo: string;
  orderKey: string;
  paymentMethod: PaymentMethod;
  payKind?: PayKind;
  orderItems: Array<{
    productId: number;
    quantity: number;
  }>;
  cardType?: "SAMSUNG" | "KB" | "HYUNDAI" | "SHINHAN";
  cardNumber?: string;
  couponId?: number | null;
}

export interface OrderPaymentSessionResponse {
  orderNo: string;
  paymentKey: string;
  amount: number;
  paymentUrl: string;
  pgKind: string;
}
