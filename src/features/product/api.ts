import { client } from "@/lib/api/client";
import type {
  ProductDetailResponse,
  ProductListParams,
  ProductSummaryResponse,
} from "./types";

export async function getProductList(
  params: Omit<ProductListParams, "brandId">
): Promise<ProductSummaryResponse> {
  const search = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
    productSort: params.productSort,
  });
  return client.get<ProductSummaryResponse>(`/products?${search}`);
}

export async function getProductListOptimized(
  params: ProductListParams
): Promise<ProductSummaryResponse> {
  const search = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
    productSort: params.productSort,
    brandId: String(params.brandId ?? 0),
  });
  return client.get<ProductSummaryResponse>(`/products/optimized?${search}`);
}

export async function getProductListDenormalized(
  params: ProductListParams
): Promise<ProductSummaryResponse> {
  const search = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
    productSort: params.productSort,
    brandId: String(params.brandId ?? 0),
  });
  return client.get<ProductSummaryResponse>(`/products/denormalized?${search}`);
}

export async function getProductDetail(productId: number): Promise<ProductDetailResponse> {
  return client.get<ProductDetailResponse>(`/products/${productId}`);
}
