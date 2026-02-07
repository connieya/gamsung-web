"use client";

import Link from "next/link";
import type { ProductSummaryItem } from "@/features/product/types";

interface ProductCardProps {
  product: ProductSummaryItem;
  liked?: boolean;
  onLike?: (productId: number) => void;
  onUnlike?: (productId: number) => void;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR").format(price) + "원";
}

export function ProductCard({
  product,
  liked = false,
  onLike,
  onUnlike,
}: ProductCardProps) {
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked && onUnlike) onUnlike(product.productId);
    else if (!liked && onLike) onLike(product.productId);
  };

  return (
    <Link
      href={`/products/${product.productId}`}
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="aspect-square bg-gray-100" />
      <div className="p-3">
        <p className="text-xs text-gray-500">{product.brandName}</p>
        <h3 className="mt-0.5 font-medium text-gray-900 line-clamp-2 group-hover:underline">
          {product.productName}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-semibold text-gray-900">
            {formatPrice(product.price)}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">
              ♥ {product.likeCount}
            </span>
            {(onLike || onUnlike) && (
              <button
                type="button"
                onClick={handleLikeClick}
                className="rounded p-1 hover:bg-gray-100"
                aria-label={liked ? "좋아요 취소" : "좋아요"}
              >
                <span className={liked ? "text-red-500" : "text-gray-400"}>
                  {liked ? "♥" : "♡"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
