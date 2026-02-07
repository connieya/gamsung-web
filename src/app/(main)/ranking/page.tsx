"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/domain/ProductCard";
import { Spinner } from "@/components/ui/Spinner";
import { useRanking } from "@/features/ranking/hooks";

const PAGE_SIZE = 12;

export default function RankingPage() {
  const today = useMemo(
    () => new Date().toISOString().slice(0, 10),
    []
  );
  const { data, isLoading, isError, error } = useRanking({
    page: 0,
    size: PAGE_SIZE,
    date: today,
  });

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
        <p className="text-red-600">{error?.message ?? "랭킹을 불러올 수 없습니다."}</p>
        <Link href="/" className="mt-4 inline-block text-gray-600 underline">
          홈으로
        </Link>
      </div>
    );
  }

  const items = data?.items ?? [];
  const isEmpty = items.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">인기 랭킹</h1>
      <p className="mt-1 text-sm text-gray-500">기준일: {today}</p>
      {isEmpty ? (
        <p className="mt-8 text-center text-gray-500">표시할 랭킹이 없습니다.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {items.map((product, index) => (
            <div key={product.productId} className="relative">
              <span className="absolute left-2 top-2 z-10 rounded bg-black px-2 py-0.5 text-xs font-bold text-white">
                {index + 1}
              </span>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
