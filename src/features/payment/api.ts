import { client } from "@/lib/api/client";
import { USER_ID_HEADER } from "@/lib/api/headers";
import type { PaymentRequest, PaymentResponse } from "./types";

function headers(userId: string): HeadersInit {
  return { [USER_ID_HEADER]: userId };
}

export async function processPayment(
  userId: string,
  request: PaymentRequest
): Promise<PaymentResponse> {
  return client.post<PaymentResponse>("/payments", request, {
    headers: headers(userId),
  });
}
