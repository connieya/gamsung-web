export interface LikedProduct {
  productId: number;
  productName: string;
  productPrice: number;
  brandName: string;
  likeCount: number;
}

export interface LikedProductResponse {
  likedProducts: LikedProduct[];
}
