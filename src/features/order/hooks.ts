"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import { getOrderDetail, getOrders, placeOrder } from "./api";
import type { OrderPlaceRequest } from "./types";

const ordersKey = ["order", "list"] as const;
const orderDetailKey = ["order", "detail"] as const;

export function useOrders() {
  const userId = useAuthStore((s) => s.userId);
  return useQuery({
    queryKey: [...ordersKey, userId ?? ""],
    queryFn: () => getOrders(userId!),
    enabled: !!userId,
  });
}

export function useOrderDetail(orderId: number | null) {
  const userId = useAuthStore((s) => s.userId);
  return useQuery({
    queryKey: [...orderDetailKey, orderId, userId ?? ""],
    queryFn: () => getOrderDetail(userId!, orderId!),
    enabled: !!userId && orderId != null,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);
  return useMutation({
    mutationFn: (body: OrderPlaceRequest) => placeOrder(userId!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersKey });
    },
  });
}
