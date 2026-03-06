"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ProductCard } from "@/components/domain/ProductCard";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useCategoryTree, useCategoryProducts } from "@/features/category/hooks";
import { useAuthStore } from "@/features/auth/store";
import { useAddLike, useRemoveLike, useMyLikes } from "@/features/likes/hooks";
import type { ProductSort } from "@/features/product/types";
import type { CategoryItem } from "@/features/category/types";

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "LATEST_DESC", label: "최신순" },
  { value: "LIKES_DESC", label: "인기순" },
  { value: "PRICE_ASC", label: "낮은 가격순" },
  { value: "PRICE_DESC", label: "높은 가격순" },
];

const PAGE_SIZE = 20;

function findCategory(categories: CategoryItem[], id: number): CategoryItem | null {
  for (const cat of categories) {
    if (cat.id === id) return cat;
    const found = findCategory(cat.children, id);
    if (found) return found;
  }
  return null;
}

function findParentCategory(categories: CategoryItem[], id: number): CategoryItem | null {
  for (const cat of categories) {
    if (cat.children.some((child) => child.id === id)) return cat;
    const found = findParentCategory(cat.children, id);
    if (found) return found;
  }
  return null;
}

export default function CategoryGoodsPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params?.id ? Number(params.id) : null;

  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<ProductSort>("LATEST_DESC");
  const userId = useAuthStore((s) => s.userId);

  const { data: categoryData, isLoading: categoryLoading } = useCategoryTree();
  const categories = categoryData?.categories ?? [];

  const category = categoryId != null ? findCategory(categories, categoryId) : null;
  const parentCategory = categoryId != null ? findParentCategory(categories, categoryId) : null;

  // 최상위 카테고리인 경우 자기 자신이 parent
  const isTopLevel = parentCategory === null && category != null;
  const siblingCategories = isTopLevel
    ? categories
    : (parentCategory?.children ?? []);

  const { data: productData, isLoading: productLoading, isError, error } = useCategoryProducts({
    categoryId,
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

  if (categoryId == null) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <p className="text-body text-red-600">잘못된 카테고리입니다.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-body text-brand-gray underline hover:text-brand-black"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  if (categoryLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const products = productData?.items ?? [];
  const totalPage = productData?.totalPage ?? 1;
  const totalItems = productData?.totalItems ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* 브레드크럼 */}
      <nav className="flex items-center gap-1.5 text-caption text-brand-gray">
        <Link href="/" className="hover:text-brand-black">
          홈
        </Link>
        <span>/</span>
        {parentCategory && !isTopLevel && (
          <>
            <Link
              href={`/category/${parentCategory.id}/goods`}
              className="hover:text-brand-black"
            >
              {parentCategory.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-brand-black">{category?.name ?? "카테고리"}</span>
      </nav>

      {/* 카테고리 타이틀 */}
      <h1 className="mt-4 text-display font-bold text-brand-black">
        {category?.name ?? "카테고리"}
      </h1>

      {/* 하위/형제 카테고리 탭 */}
      {siblingCategories.length > 1 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {/* 전체 보기 (부모 카테고리) */}
          {parentCategory && !isTopLevel && (
            <button
              type="button"
              onClick={() => {
                router.push(`/category/${parentCategory.id}/goods`);
              }}
              className={`rounded-full border px-4 py-2 text-body transition-colors ${
                categoryId === parentCategory.id
                  ? "border-brand-black bg-brand-black text-brand-white"
                  : "border-brand-border bg-brand-white text-brand-black hover:bg-brand-bg"
              }`}
            >
              전체
            </button>
          )}
          {siblingCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setPage(0);
                router.push(`/category/${cat.id}/goods`);
              }}
              className={`rounded-full border px-4 py-2 text-body transition-colors ${
                cat.id === categoryId
                  ? "border-brand-black bg-brand-black text-brand-white"
                  : "border-brand-border bg-brand-white text-brand-black hover:bg-brand-bg"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* 하위 카테고리 칩 (선택된 카테고리가 자식을 가진 경우) */}
      {category && category.children.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {category.children.map((child) => (
            <Link
              key={child.id}
              href={`/category/${child.id}/goods`}
              className="rounded-full border border-brand-border bg-brand-white px-3.5 py-1.5 text-caption text-brand-black transition-colors hover:bg-brand-bg"
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}

      {/* 상품 수 + 정렬 */}
      <div className="mt-6 flex items-center justify-between border-b border-brand-border pb-4">
        <p className="text-body text-brand-gray">
          상품 <span className="font-semibold text-brand-black">{totalItems.toLocaleString()}</span>개
        </p>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as ProductSort);
            setPage(0);
          }}
          className="rounded-lg border border-brand-border bg-brand-white px-4 py-2.5 text-body text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-black"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 상품 그리드 */}
      {productLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : isError ? (
        <div className="py-16 text-center">
          <p className="text-body text-red-600">
            {error?.message ?? "상품을 불러올 수 없습니다."}
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-body text-brand-gray">해당 카테고리에 상품이 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                liked={likedIds.has(product.productId)}
                onLike={
                  userId ? () => addLike.mutate(product.productId) : undefined
                }
                onUnlike={
                  userId ? () => removeLike.mutate(product.productId) : undefined
                }
              />
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPage > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <Button
                variant="secondary"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                이전
              </Button>
              <span className="text-body text-brand-gray">
                {page + 1} / {totalPage}
              </span>
              <Button
                variant="secondary"
                disabled={page >= totalPage - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                다음
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
