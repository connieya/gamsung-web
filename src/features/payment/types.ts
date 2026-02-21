export type PaymentMethod = "CARD" | "POINT" | "ACCOUNT" | "SIMPLE_PAY";
export type PayKind = "CARD" | "POINT" | "ACCOUNT_TRANSFER" | "KAKAOPAY" | "TOSSPAY" | "NAVERPAY" | "PAYCO";
export type CardType = "SAMSUNG" | "KB" | "HYUNDAI" | "SHINHAN";

export interface PaymentRequest {
  orderId: number;
  paymentMethod: PaymentMethod;
  payKind: PayKind;
  cardType?: CardType;
  cardNumber?: string;
}

export interface PaymentResponse {
  paymentId: number;
  orderId: number;
  amount: number;
  status: string;
}
