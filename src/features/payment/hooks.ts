import { useMutation } from "@tanstack/react-query";
import { processPayment } from "./api";
import type { PaymentRequest } from "./types";
import { useAuthStore } from "@/features/auth/store";

export function useProcessPayment() {
  const userId = useAuthStore((s) => s.userId);

  return useMutation({
    mutationFn: (request: PaymentRequest) =>
      processPayment(userId!, request),
  });
}
