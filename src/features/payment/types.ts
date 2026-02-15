export type PaymentMethod = "CARD" | "POINT";
export type CardType = "CREDIT" | "DEBIT";

export interface PaymentRequest {
  orderId: number;
  paymentMethod: PaymentMethod;
  cardType?: CardType;
  cardNumber?: string;
}

export interface PaymentResponse {
  paymentId: number;
  orderId: number;
  amount: number;
  status: string;
}
