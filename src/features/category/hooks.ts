"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories, getCategoryProducts } from "./api";
import type { ProductSort } from "@/features/product/types";

const categoryKey = ["category"] as const;

export function useCategoryTree() {
  return useQuery({
    queryKey: [...categoryKey, "tree"],
    queryFn: getCategories,
  });
}

export function useCategoryProducts(params: {
  categoryId: number | null;
  page: number;
  size: number;
  productSort: ProductSort;
}) {
  return useQuery({
    queryKey: [...categoryKey, params.categoryId, "products", {
      page: params.page,
      size: params.size,
      productSort: params.productSort,
    }],
    queryFn: () =>
      getCategoryProducts({
        categoryId: params.categoryId!,
        page: params.page,
        size: params.size,
        productSort: params.productSort,
      }),
    enabled: params.categoryId != null,
  });
}
