import { client } from "@/lib/api/client";
import { USER_ID_HEADER } from "@/lib/api/headers";
import type {
  OrderIssueOrderNoRequest,
  OrderIssueOrderNoResponse,
  OrderPlaceRequest,
  OrderPlaceResponse,
} from "./types";

function headers(userId: string): HeadersInit {
  return { [USER_ID_HEADER]: userId };
}

export async function placeOrder(
  userId: string,
  body: OrderPlaceRequest
): Promise<OrderPlaceResponse> {
  return client.post<OrderPlaceResponse>("/orders", body, { headers: headers(userId) });
}

export async function issueOrderNo(
  userId: string,
  body: OrderIssueOrderNoRequest
): Promise<OrderIssueOrderNoResponse> {
  return client.post<OrderIssueOrderNoResponse>("/orders/order-no", body, {
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
