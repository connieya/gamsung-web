"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import { claimCoupon, getAvailableCoupons, getMyCoupons, issueCoupon } from "./api";
import type { ClaimCouponRequest } from "./types";

const myCouponsKey = ["myCoupons"] as const;
const availableCouponsKey = ["availableCoupons"] as const;

export function useMyCoupons() {
  const userId = useAuthStore((s) => s.userId);
  return useQuery({
    queryKey: [...myCouponsKey, userId ?? ""],
    queryFn: () => getMyCoupons(userId!),
    enabled: !!userId,
  });
}

export function useAvailableCoupons() {
  const userId = useAuthStore((s) => s.userId);
  return useQuery({
    queryKey: [...availableCouponsKey, userId ?? ""],
    queryFn: () => getAvailableCoupons(userId!),
    enabled: !!userId,
  });
}

export function useIssueCoupon() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);
  return useMutation({
    mutationFn: (couponId: number) => issueCoupon(userId!, couponId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myCouponsKey });
      queryClient.invalidateQueries({ queryKey: availableCouponsKey });
    },
  });
}

export function useClaimCoupon() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);
  return useMutation({
    mutationFn: (body: ClaimCouponRequest) => claimCoupon(userId!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myCouponsKey });
    },
  });
}
