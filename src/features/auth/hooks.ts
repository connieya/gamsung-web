"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "./store";
import { getMe, registerUser } from "./api";
import type { UserRequest } from "./types";

const queryKey = ["auth", "me"] as const;

export function useMe() {
  const userId = useAuthStore((s) => s.userId);
  return useQuery({
    queryKey: [...queryKey, userId ?? ""],
    queryFn: () => getMe(userId!),
    enabled: !!userId,
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const setUserId = useAuthStore((s) => s.setUserId);
  return useMutation({
    mutationFn: (body: UserRequest) => registerUser(body),
    onSuccess: (_, variables) => {
      setUserId(variables.userId);
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
