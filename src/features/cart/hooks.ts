import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "./api";
import type { AddToCartRequest, UpdateQuantityRequest } from "./types";
import { useAuthStore } from "@/features/auth/store";

const cartKeys = {
  all: ["cart"] as const,
  detail: (userId: string | null) => [...cartKeys.all, "detail", userId] as const,
};

export function useCart() {
  const userId = useAuthStore((s) => s.userId);

  return useQuery({
    queryKey: cartKeys.detail(userId),
    queryFn: () => getCart(userId!),
    enabled: !!userId,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  return useMutation({
    mutationFn: (request: AddToCartRequest) =>
      addToCart(userId!, request),
    onSuccess: (cart) => {
      // Reflect the latest cart immediately so header badge updates without delay.
      queryClient.setQueryData(cartKeys.detail(userId), cart);
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      updateCartItemQuantity(userId!, itemId, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  return useMutation({
    mutationFn: (itemId: number) => removeCartItem(userId!, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  return useMutation({
    mutationFn: () => clearCart(userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}
