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

export interface OrderFormResponse {
  member: {
    name: string;
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
  paymentMethod: "CARD" | "POINT";
  payKind?: "CARD" | "POINT" | "KAKAOPAY" | "TOSSPAY" | "NAVERPAY" | "PAYCO";
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
  paymentMethod: "CARD" | "POINT";
  payKind?: "CARD" | "POINT" | "KAKAOPAY" | "TOSSPAY" | "NAVERPAY" | "PAYCO";
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
