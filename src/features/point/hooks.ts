"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import { chargePoint, getPoint } from "./api";
import type { PointRequest } from "./types";

const pointKey = ["point"] as const;

export function usePoint() {
  const userId = useAuthStore((s) => s.userId);
  return useQuery({
    queryKey: [...pointKey, userId ?? ""],
    queryFn: () => getPoint(userId!),
    enabled: !!userId,
  });
}

export function useChargePoint() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);
  return useMutation({
    mutationFn: (body: PointRequest) => chargePoint(userId!, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pointKey });
    },
  });
}
