"use client";

import { useQuery } from "@tanstack/react-query";
import { getBrands, getBrand } from "./api";

const brandKey = ["brand"] as const;

export function useBrandList() {
  return useQuery({
    queryKey: [...brandKey, "list"],
    queryFn: getBrands,
  });
}

export function useBrand(brandId: number | null) {
  return useQuery({
    queryKey: [...brandKey, brandId],
    queryFn: () => getBrand(brandId!),
    enabled: brandId != null,
  });
}
