"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getProductDetail,
  getProductList,
  getProductListDenormalized,
} from "./api";
import type { ProductListParams, ProductSort } from "./types";

const productListKey = ["product", "list"] as const;
const productDetailKey = ["product", "detail"] as const;

export function useProductList(params: {
  page: number;
  size: number;
  productSort: ProductSort;
  brandId?: number;
}) {
  const queryParams: ProductListParams = {
    page: params.page,
    size: params.size,
    productSort: params.productSort,
    brandId: params.brandId,
  };
  const fetcher = params.brandId != null ? getProductListDenormalized : getProductList;
  return useQuery({
    queryKey: [...productListKey, queryParams],
    queryFn: () => fetcher(queryParams),
  });
}

export function useProductDetail(productId: number | null) {
  return useQuery({
    queryKey: [...productDetailKey, productId],
    queryFn: () => getProductDetail(productId!),
    enabled: productId != null,
  });
}
