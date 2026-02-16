"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/domain/ProductCard";
import { Spinner } from "@/components/ui/Spinner";
import { useProductList } from "@/features/product/hooks";
import { useAuthStore } from "@/features/auth/store";
import { useAddLike, useRemoveLike, useMyLikes } from "@/features/likes/hooks";

const PAGE_SIZE = 12;

export default function BrandByNamePage() {
  const params = useParams();
  const brandName = params?.name ? decodeURIComponent(String(params.name)) : null;
  const userId = useAuthStore((s) => s.userId);
  
  // 브랜드 이름으로 필터링된 상품 목록 조회
  // 브랜드 ID를 모르므로 모든 상품을 조회하고 클라이언트에서 필터링
  const { data: productData, isLoading: productLoading } = useProductList({
    page: 0,
    size: 100, // 충분한 수량 조회
    productSort: "LATEST_DESC",
  });
  
  const { data: likesData } = useMyLikes();
  const likedIds = new Set(
    likesData?.likedProducts?.map((p) => p.productId) ?? []
  );
  const addLike = useAddLike();
  const removeLike = useRemoveLike();

  // 브랜드 이름으로 필터링
  const filteredProducts = productData?.items?.filter(
    (product) => product.brandName === brandName
  ) ?? [];

  // 브랜드 정보 추출 (첫 번째 상품에서)
  const brandInfo = filteredProducts.length > 0 
    ? { name: filteredProducts[0].brandName }
    : null;

  if (!brandName) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <p className="text-body text-red-600">브랜드 이름이 필요합니다.</p>
        <Link
          href="/products"
          className="mt-4 inline-block text-body text-brand-gray underline hover:text-brand-black"
        >
          상품 목록으로
        </Link>
      </div>
    );
  }

  if (productLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <p className="text-body text-brand-gray">해당 브랜드의 상품을 찾을 수 없습니다.</p>
        <Link
          href="/products"
          className="mt-4 inline-block text-body text-brand-gray underline hover:text-brand-black"
        >
          상품 목록으로
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="rounded-2xl border border-brand-border bg-brand-white p-8">
        <h1 className="text-display font-bold text-brand-black">{brandInfo?.name ?? brandName}</h1>
        <p className="mt-3 text-body text-brand-gray">
          {filteredProducts.length}개의 상품
        </p>
      </div>
      <h2 className="mt-10 text-title font-semibold text-brand-black">
        상품 목록
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
        {filteredProducts.map((product) => (
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
    </div>
  );
}
