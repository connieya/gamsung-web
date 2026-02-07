"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/domain/ProductCard";
import { Spinner } from "@/components/ui/Spinner";
import { useBrand } from "@/features/brand/hooks";
import { useProductList } from "@/features/product/hooks";
import { useAuthStore } from "@/features/auth/store";
import { useAddLike, useRemoveLike, useMyLikes } from "@/features/likes/hooks";

const PAGE_SIZE = 12;

export default function BrandPage() {
  const params = useParams();
  const brandId = params?.id ? Number(params.id) : null;
  const userId = useAuthStore((s) => s.userId);
  const { data: brand, isLoading: brandLoading, isError: brandError } = useBrand(brandId);
  const { data: productData, isLoading: productLoading } = useProductList({
    page: 0,
    size: PAGE_SIZE,
    productSort: "LATEST_DESC",
    brandId: brandId ?? undefined,
  });
  const { data: likesData } = useMyLikes();
  const likedIds = new Set(
    likesData?.likedProducts?.map((p) => p.productId) ?? []
  );
  const addLike = useAddLike();
  const removeLike = useRemoveLike();

  if (brandId == null || brandError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <p className="text-red-600">해당 브랜드를 찾을 수 없습니다.</p>
        <Link href="/products" className="mt-4 inline-block text-gray-600 underline">
          상품 목록으로
        </Link>
      </div>
    );
  }

  if (brandLoading || !brand) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const products = productData?.items ?? [];
  const isLoadingProducts = productLoading;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">{brand.name}</h1>
      {brand.description && (
        <p className="mt-2 text-gray-600">{brand.description}</p>
      )}
      <h2 className="mt-8 text-lg font-semibold text-gray-900">상품 목록</h2>
      {isLoadingProducts ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : products.length === 0 ? (
        <p className="mt-4 text-gray-500">표시할 상품이 없습니다.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              liked={likedIds.has(product.productId)}
              onLike={userId ? () => addLike.mutate(product.productId) : undefined}
              onUnlike={userId ? () => removeLike.mutate(product.productId) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
