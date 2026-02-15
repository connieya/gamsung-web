export type ProductSort =
  | "LATEST_DESC"
  | "LATEST_ASC"
  | "LIKES_ASC"
  | "LIKES_DESC"
  | "DENORMALIZED_LIKES_ASC"
  | "DENORMALIZED_LIKES_DESC"
  | "PRICE_ASC"
  | "PRICE_DESC";

export interface ProductSummaryItem {
  productId: number;
  price: number;
  productName: string;
  brandName: string;
  imageUrl: string | null;
  likeCount: number;
  releasedAt: string;
}

export interface ProductSummaryResponse {
  totalPage: number;
  page: number;
  size: number;
  totalItems: number;
  items: ProductSummaryItem[];
}

export interface ProductDetailResponse {
  productId: number;
  productName: string;
  price: number;
  brandName: string;
  imageUrl: string | null;
  likeCount: number;
  rank: number | null;
}

export interface ProductListParams {
  page: number;
  size: number;
  productSort: ProductSort;
  brandId?: number;
}
