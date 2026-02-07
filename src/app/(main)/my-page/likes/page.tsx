"use client";

import Link from "next/link";
import { ProductCard } from "@/components/domain/ProductCard";
import { Spinner } from "@/components/ui/Spinner";
import { useAuthStore } from "@/features/auth/store";
import { useMyLikes } from "@/features/likes/hooks";

function toSummaryItem(
  p: { productId: number; productName: string; productPrice: number; brandName: string; likeCount: number }
) {
  return {
    productId: p.productId,
    productName: p.productName,
    price: p.productPrice,
    brandName: p.brandName,
    likeCount: p.likeCount,
    releasedAt: "",
  };
}

export default function LikesPage() {
  const userId = useAuthStore((s) => s.userId);
  const { data, isLoading, isError } = useMyLikes();

  if (!userId) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <p className="text-gray-600">로그인이 필요합니다.</p>
        <Link href="/login" className="mt-4 inline-block text-gray-900 underline">
          로그인
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <p className="text-red-600">좋아요 목록을 불러올 수 없습니다.</p>
      </div>
    );
  }

  const items = data?.likedProducts ?? [];
  const isEmpty = items.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">좋아요 목록</h1>
      {isEmpty ? (
        <p className="mt-8 text-center text-gray-500">좋아요 한 상품이 없습니다.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.productId} product={toSummaryItem(p)} />
          ))}
        </div>
      )}
      <Link href="/my-page" className="mt-6 inline-block text-gray-600 underline">
        마이페이지로
      </Link>
    </div>
  );
}
