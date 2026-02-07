export interface RankingItem {
  productId: number;
  price: number;
  productName: string;
  brandName: string;
  likeCount: number;
  releasedAt: string;
}

export interface RankingSummaryResponse {
  items: RankingItem[];
}
