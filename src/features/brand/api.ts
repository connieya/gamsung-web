import { client } from "@/lib/api/client";
import type { BrandResponse } from "./types";

export async function getBrand(brandId: number): Promise<BrandResponse> {
  return client.get<BrandResponse>(`/brands/${brandId}`);
}
