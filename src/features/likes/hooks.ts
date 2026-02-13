"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import { addLike, getMyLikes, removeLike } from "./api";

const likesKey = ["likes", "my"] as const;

export function useMyLikes() {
  const userId = useAuthStore((s) => s.userId);
  return useQuery({
    queryKey: [...likesKey, userId ?? ""],
    queryFn: () => getMyLikes(userId!),
    enabled: !!userId,
  });
}

const productDetailKey = ["product", "detail"] as const;

export function useAddLike() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);
  return useMutation({
    mutationFn: (productId: number) => addLike(userId!, productId),
    onSuccess: (_data, productId) => {
      queryClient.invalidateQueries({ queryKey: likesKey });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: [...productDetailKey, productId] });
    },
  });
}

export function useRemoveLike() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);
  return useMutation({
    mutationFn: (productId: number) => removeLike(userId!, productId),
    onSuccess: (_data, productId) => {
      queryClient.invalidateQueries({ queryKey: likesKey });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: [...productDetailKey, productId] });
    },
  });
}
