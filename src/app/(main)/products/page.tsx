"use client";

import { useState } from "react";
import { ProductCard } from "@/components/domain/ProductCard";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useProductList } from "@/features/product/hooks";
import { useAuthStore } from "@/features/auth/store";
import { useAddLike, useRemoveLike, useMyLikes } from "@/features/likes/hooks";
import type { ProductSort } from "@/features/product/types";

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "LATEST_DESC", label: "최신순" },
  { value: "LIKES_DESC", label: "인기순" },
  { value: "PRICE_ASC", label: "가격 낮은순" },
  { value: "PRICE_DESC", label: "가격 높은순" },
];

const PAGE_SIZE = 12;

export default function ProductListPage() {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<ProductSort>("LATEST_DESC");
  const userId = useAuthStore((s) => s.userId);
  const { data, isLoading, isError, error } = useProductList({
    page,
    size: PAGE_SIZE,
    productSort: sort,
  });
  const { data: likesData } = useMyLikes();
  const likedIds = new Set(
    likesData?.likedProducts?.map((p) => p.productId) ?? []
  );
  const addLike = useAddLike();
  const removeLike = useRemoveLike();

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
        <p className="text-red-600">{error?.message ?? "목록을 불러올 수 없습니다."}</p>
      </div>
    );
  }

  const isEmpty = !data?.items?.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">상품 목록</h1>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <span className="text-sm text-gray-600">정렬</span>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as ProductSort);
            setPage(0);
          }}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {isEmpty ? (
        <p className="mt-12 text-center text-gray-500">표시할 상품이 없습니다.</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {data.items.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                liked={likedIds.has(product.productId)}
                onLike={userId ? () => addLike.mutate(product.productId) : undefined}
                onUnlike={userId ? () => removeLike.mutate(product.productId) : undefined}
              />
            ))}
          </div>
          <div className="mt-8 flex justify-center gap-2">
            <Button
              variant="secondary"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              이전
            </Button>
            <span className="flex items-center px-4 text-sm text-gray-600">
              {page + 1} / {data.totalPage || 1}
            </span>
            <Button
              variant="secondary"
              disabled={page >= (data.totalPage ?? 1) - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              다음
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
