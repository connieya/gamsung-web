"use client";

import { useQuery } from "@tanstack/react-query";
import { getBrands, getBrand } from "./api";

const brandKey = ["brand"] as const;

export function useBrandList(enabled = true) {
  return useQuery({
    queryKey: [...brandKey, "list"],
    queryFn: getBrands,
    enabled,
  });
}

export function useBrand(brandId: number | null) {
  return useQuery({
    queryKey: [...brandKey, brandId],
    queryFn: () => getBrand(brandId!),
    enabled: brandId != null,
  });
}
