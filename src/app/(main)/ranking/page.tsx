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
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <p className="text-body text-red-600">
          {error?.message ?? "랭킹을 불러올 수 없습니다."}
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-body text-brand-gray underline hover:text-brand-black"
        >
          홈으로
        </Link>
      </div>
    );
  }

  const items = data?.items ?? [];
  const isEmpty = items.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <h1 className="text-display font-bold text-brand-black">인기 랭킹</h1>
        <p className="text-body text-brand-gray">기준일: {today}</p>
      </div>
      {isEmpty ? (
        <div className="mt-20 py-16 text-center">
          <p className="text-body text-brand-gray">표시할 랭킹이 없습니다.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
          {items.map((product, index) => (
            <div key={product.productId} className="relative">
              <span className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-brand-black text-caption font-bold text-white">
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
