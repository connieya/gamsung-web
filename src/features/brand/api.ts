import { client } from "@/lib/api/client";
import type { BrandResponse, BrandListResponse } from "./types";

export async function getBrands(): Promise<BrandListResponse> {
  return client.get<BrandListResponse>(`/brands`);
}

export async function getBrand(brandId: number): Promise<BrandResponse> {
  return client.get<BrandResponse>(`/brands/${brandId}`);
}
