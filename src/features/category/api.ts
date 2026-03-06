import { client } from "@/lib/api/client";
import type { ProductSummaryResponse } from "@/features/product/types";
import type { CategoryTreeResponse, CategoryProductsParams } from "./types";

export async function getCategories(): Promise<CategoryTreeResponse> {
  return client.get<CategoryTreeResponse>("/categories");
}

export async function getCategoryProducts(
  params: CategoryProductsParams
): Promise<ProductSummaryResponse> {
  const search = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
    productSort: params.productSort,
  });
  return client.get<ProductSummaryResponse>(
    `/categories/${params.categoryId}/products?${search}`
  );
}
