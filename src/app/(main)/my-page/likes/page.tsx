"use client";

import Link from "next/link";
import { ProductCard } from "@/components/domain/ProductCard";
import { Spinner } from "@/components/ui/Spinner";
import { useAuthStore } from "@/features/auth/store";
import { useMyLikes } from "@/features/likes/hooks";

function toSummaryItem(
  p: {
    productId: number;
    productName: string;
    productPrice: number;
    brandName: string;
    likeCount: number;
  }
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
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
        <p className="text-body text-brand-gray">로그인이 필요합니다.</p>
        <Link
          href="/login"
          className="mt-4 inline-block text-body font-medium text-brand-black underline hover:opacity-80"
        >
          로그인
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <p className="text-body text-red-600">좋아요 목록을 불러올 수 없습니다.</p>
      </div>
    );
  }

  const items = data?.likedProducts ?? [];
  const isEmpty = items.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-display font-bold text-brand-black">좋아요 목록</h1>
      {isEmpty ? (
        <div className="mt-12 rounded-xl border border-brand-border bg-brand-white p-12 text-center">
          <p className="text-body text-brand-gray">좋아요 한 상품이 없습니다.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
          {items.map((p) => (
            <ProductCard key={p.productId} product={toSummaryItem(p)} />
          ))}
        </div>
      )}
      <Link
        href="/my-page"
        className="mt-8 inline-block text-body text-brand-gray underline hover:text-brand-black"
      >
        마이페이지로
      </Link>
    </div>
  );
}
