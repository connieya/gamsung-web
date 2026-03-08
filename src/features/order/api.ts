import { client } from "@/lib/api/client";
import { USER_ID_HEADER } from "@/lib/api/headers";
import type {
  OrderIssueOrderNoRequest,
  OrderIssueOrderNoResponse,
  OrderFormResponse,
  OrderReadyRequest,
  OrderReadyResponse,
  OrderPaymentSessionRequest,
  OrderPaymentSessionResponse,
} from "./types";

function headers(userId: string): HeadersInit {
  return { [USER_ID_HEADER]: userId };
}

export async function issueOrderNo(
  userId: string,
  body: OrderIssueOrderNoRequest
): Promise<OrderIssueOrderNoResponse> {
  return client.post<OrderIssueOrderNoResponse>("/orders/order-no", body, {
    headers: headers(userId),
  });
}

export async function getOrderForm(
  userId: string,
  cartItemIds: number[],
  timestamp: number
): Promise<OrderFormResponse> {
  const params = new URLSearchParams();
  if (cartItemIds.length > 0) {
    cartItemIds.forEach((id) => params.append("cartItemIds", String(id)));
  }
  params.append("t", String(timestamp));
  return client.get<OrderFormResponse>(
    `/orders/order-form?${params.toString()}`,
    { headers: headers(userId) }
  );
}

export async function readyOrder(
  userId: string,
  orderNo: string,
  body: OrderReadyRequest
): Promise<OrderReadyResponse> {
  return client.post<OrderReadyResponse>(`/orders/${orderNo}/ready`, body, {
    headers: headers(userId),
  });
}

export async function createPaymentSession(
  userId: string,
  body: OrderPaymentSessionRequest
): Promise<OrderPaymentSessionResponse> {
  return client.post<OrderPaymentSessionResponse>("/payments/session", body, {
    headers: headers(userId),
  });
}

export async function getOrders(userId: string): Promise<unknown> {
  return client.get("/orders", { headers: headers(userId) });
}

export async function getOrderDetail(
  userId: string,
  orderId: number
): Promise<unknown> {
  return client.get(`/orders/${orderId}`, { headers: headers(userId) });
}
