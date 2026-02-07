"use client";

import { useQuery } from "@tanstack/react-query";
import { getBrand } from "./api";

const brandKey = ["brand"] as const;

export function useBrand(brandId: number | null) {
  return useQuery({
    queryKey: [...brandKey, brandId],
    queryFn: () => getBrand(brandId!),
    enabled: brandId != null,
  });
}
