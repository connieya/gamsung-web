"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ProductCard } from "@/components/domain/ProductCard";
import { BrandCard } from "@/components/domain/BrandCard";
import { Spinner } from "@/components/ui/Spinner";
import { useProductList } from "@/features/product/hooks";
import { useRanking } from "@/features/ranking/hooks";
import { useBrandList } from "@/features/brand/hooks";
import { useAuthStore } from "@/features/auth/store";
import { useAddLike, useRemoveLike, useMyLikes } from "@/features/likes/hooks";

const NEW_PRODUCTS_COUNT = 8;
const POPULAR_PRODUCTS_COUNT = 8;
const BRANDS_COUNT = 12;

export default function HomePage() {
  const userId = useAuthStore((s) => s.userId);
  const today = useMemo(
    () => new Date().toISOString().slice(0, 10),
    []
  );

  // 신상품 조회
  const { data: newProductsData, isLoading: newProductsLoading } = useProductList({
    page: 0,
    size: NEW_PRODUCTS_COUNT,
    productSort: "LATEST_DESC",
  });

  // 인기 상품 조회 (랭킹)
  const { data: rankingData, isLoading: rankingLoading } = useRanking({
    page: 0,
    size: POPULAR_PRODUCTS_COUNT,
    date: today,
  });

  // 브랜드 목록 조회
  const { data: brandsData, isLoading: brandsLoading } = useBrandList();

  // 좋아요 정보
  const { data: likesData } = useMyLikes();
  const likedIds = new Set(
    likesData?.likedProducts?.map((p) => p.productId) ?? []
  );
  const addLike = useAddLike();
  const removeLike = useRemoveLike();

  // 브랜드 목록 (API에서 직접 조회)
  const brands = brandsData?.brands?.slice(0, BRANDS_COUNT) ?? [];

  const newProducts = newProductsData?.items?.slice(0, NEW_PRODUCTS_COUNT) ?? [];
  const popularProductsRaw = rankingData?.items?.slice(0, POPULAR_PRODUCTS_COUNT) ?? [];

  // 랭킹 상품의 imageUrl 매핑 (상품 목록에서 가져오기)
  const popularProducts = useMemo(() => {
    if (!popularProductsRaw.length || !newProductsData?.items) {
      return popularProductsRaw.map((p) => ({
        ...p,
        imageUrl: null,
      }));
    }

    // 상품 목록에서 imageUrl 매핑
    const productMap = new Map(
      newProductsData.items.map((p) => [p.productId, p.imageUrl])
    );

    return popularProductsRaw.map((p) => ({
      ...p,
      imageUrl: productMap.get(p.productId) ?? null,
    }));
  }, [popularProductsRaw, newProductsData]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden rounded-2xl bg-brand-black py-20 text-brand-white sm:py-28">
        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
          <h1 className="text-display-lg font-bold tracking-tight sm:text-4xl">
            GAMSUNG
          </h1>
          <p className="mt-3 text-body text-white/80">
            무신사 스타일 이커머스. 스트릿부터 포멀까지.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="btn-primary inline-flex items-center px-8 py-3.5 text-body font-semibold"
            >
              스타일 보기
            </Link>
            <Link
              href="/ranking"
              className="btn-outline inline-flex items-center border-white/40 bg-transparent px-8 py-3.5 text-body font-semibold text-white hover:bg-white/10 hover:border-white"
            >
              인기 랭킹
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.15),transparent)]" />
      </section>

      {/* 브랜드 섹션 */}
      <section className="mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-display font-bold text-brand-black">브랜드</h2>
          <Link
            href="/products"
            className="text-body text-brand-gray transition-colors hover:text-brand-black"
          >
            전체 보기 →
          </Link>
        </div>
        {brandsLoading || brands.length === 0 ? (
          <div className="mt-6 flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {brands.map((brand) => (
              <BrandCard key={brand.id} brandName={brand.name} brandId={brand.id} />
            ))}
          </div>
        )}
      </section>

      {/* 신상품 섹션 */}
      <section className="mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-display font-bold text-brand-black">신상품</h2>
          <Link
            href="/products"
            className="text-body text-brand-gray transition-colors hover:text-brand-black"
          >
            전체 보기 →
          </Link>
        </div>
        {newProductsLoading ? (
          <div className="mt-6 flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : newProducts.length === 0 ? (
          <p className="mt-6 text-body text-brand-gray">표시할 신상품이 없습니다.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
            {newProducts.map((product) => (
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
        )}
      </section>

      {/* 인기 상품 섹션 */}
      <section className="mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-display font-bold text-brand-black">인기 상품</h2>
          <Link
            href="/ranking"
            className="text-body text-brand-gray transition-colors hover:text-brand-black"
          >
            전체 보기 →
          </Link>
        </div>
        {rankingLoading ? (
          <div className="mt-6 flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : popularProducts.length === 0 ? (
          <p className="mt-6 text-body text-brand-gray">표시할 인기 상품이 없습니다.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
            {popularProducts.map((product, index) => (
              <div key={product.productId} className="relative">
                <span className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-brand-black text-caption font-bold text-white">
                  {index + 1}
                </span>
                <ProductCard
                  product={{
                    productId: product.productId,
                    productName: product.productName,
                    brandName: product.brandName,
                    price: product.price,
                    imageUrl: product.imageUrl ?? null,
                    likeCount: product.likeCount,
                    releasedAt: product.releasedAt,
                  }}
                  liked={likedIds.has(product.productId)}
                  onLike={
                    userId ? () => addLike.mutate(product.productId) : undefined
                  }
                  onUnlike={
                    userId ? () => removeLike.mutate(product.productId) : undefined
                  }
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 쇼핑 카테고리 섹션 */}
      <section className="mt-20 pb-16">
        <h2 className="text-display font-bold text-brand-black">
          쇼핑 카테고리
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Link
            href="/products"
            className="group flex flex-col items-center rounded-xl border border-brand-border bg-brand-white p-6 transition-[box-shadow] hover:shadow-card-hover"
          >
            <span className="text-3xl">👕</span>
            <span className="mt-2 text-body font-medium text-brand-black group-hover:underline">
              전체 상품
            </span>
          </Link>
          <Link
            href="/ranking"
            className="group flex flex-col items-center rounded-xl border border-brand-border bg-brand-white p-6 transition-[box-shadow] hover:shadow-card-hover"
          >
            <span className="text-3xl">🔥</span>
            <span className="mt-2 text-body font-medium text-brand-black group-hover:underline">
              인기 랭킹
            </span>
          </Link>
          <Link
            href="/my-page/likes"
            className="group flex flex-col items-center rounded-xl border border-brand-border bg-brand-white p-6 transition-[box-shadow] hover:shadow-card-hover"
          >
            <span className="text-3xl">♥</span>
            <span className="mt-2 text-body font-medium text-brand-black group-hover:underline">
              좋아요
            </span>
          </Link>
          <Link
            href="/my-page"
            className="group flex flex-col items-center rounded-xl border border-brand-border bg-brand-white p-6 transition-[box-shadow] hover:shadow-card-hover"
          >
            <span className="text-3xl">👤</span>
            <span className="mt-2 text-body font-medium text-brand-black group-hover:underline">
              마이
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
