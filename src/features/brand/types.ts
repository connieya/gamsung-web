export interface BrandResponse {
  id: number;
  name: string;
  description: string;
}

export interface BrandListResponse {
  brands: BrandResponse[];
}
