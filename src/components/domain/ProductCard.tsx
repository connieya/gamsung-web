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
      className="group block overflow-hidden rounded-none bg-brand-white transition-[box-shadow] hover:shadow-card-hover"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f0f0f0]">
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        {(onLike || onUnlike) && (
          <button
            type="button"
            onClick={handleLikeClick}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lg shadow-card transition-transform hover:scale-110"
            aria-label={liked ? "좋아요 취소" : "좋아요"}
          >
            <span
              className={liked ? "text-red-500" : "text-brand-gray"}
            >
              {liked ? "♥" : "♡"}
            </span>
          </button>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <p className="text-caption text-brand-gray">{product.brandName}</p>
        <h3 className="mt-1 line-clamp-2 text-body font-medium text-brand-black group-hover:underline">
          {product.productName}
        </h3>
        <div className="mt-2 flex items-baseline justify-between gap-2">
          <span className="text-title font-semibold text-brand-black">
            {formatPrice(product.price)}
          </span>
          <span className="text-caption text-brand-gray">
            ♥ {product.likeCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
