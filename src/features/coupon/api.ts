import { client } from "@/lib/api/client";
import { USER_ID_HEADER } from "@/lib/api/headers";
import type {
  AvailableCouponsResponse,
  ClaimCouponRequest,
  ClaimCouponResponse,
  MyCouponsResponse,
} from "./types";

function headers(userId: string): HeadersInit {
  return { [USER_ID_HEADER]: userId };
}

export async function getMyCoupons(
  userId: string
): Promise<MyCouponsResponse> {
  return client.get<MyCouponsResponse>("/coupons/me", {
    headers: headers(userId),
  });
}

export async function getAvailableCoupons(
  userId: string
): Promise<AvailableCouponsResponse> {
  return client.get<AvailableCouponsResponse>("/coupons/available", {
    headers: headers(userId),
  });
}

export async function issueCoupon(
  userId: string,
  couponId: number
): Promise<void> {
  return client.post<void>(`/coupons/${couponId}/issue`, undefined, {
    headers: headers(userId),
  });
}

export async function claimCoupon(
  userId: string,
  body: ClaimCouponRequest
): Promise<ClaimCouponResponse> {
  return client.post<ClaimCouponResponse>("/coupons/claim", body, {
    headers: headers(userId),
  });
}
