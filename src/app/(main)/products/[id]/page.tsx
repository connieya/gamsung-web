"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useProductDetail } from "@/features/product/hooks";
import { useAuthStore } from "@/features/auth/store";
import { useAddLike, useRemoveLike, useMyLikes } from "@/features/likes/hooks";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR").format(price) + "원";
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id ? Number(params.id) : null;
  const userId = useAuthStore((s) => s.userId);
  const { data, isLoading, isError, error } = useProductDetail(productId);
  const { data: likesData } = useMyLikes();
  const likedIds = new Set(
    likesData?.likedProducts?.map((p) => p.productId) ?? []
  );
  const liked = productId != null && likedIds.has(productId);
  const addLike = useAddLike();
  const removeLike = useRemoveLike();

  if (productId == null || isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <p className="text-red-600">
          {error?.message ?? "해당 상품을 찾을 수 없습니다."}
        </p>
        <Link href="/products" className="mt-4 inline-block text-gray-600 underline">
          상품 목록으로
        </Link>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const handleLike = () => {
    if (!userId) {
      router.push("/login");
      return;
    }
    if (liked) removeLike.mutate(productId);
    else addLike.mutate(productId);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square bg-gray-100" />
        <div>
          <p className="text-sm text-gray-500">{data.brandName}</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {data.productName}
          </h1>
          <p className="mt-2 text-xl font-semibold text-gray-900">
            {formatPrice(data.price)}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-gray-500">♥ {data.likeCount}</span>
            {data.rank != null && (
              <span className="text-sm text-gray-500">랭크 #{data.rank}</span>
            )}
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={handleLike}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
              aria-label={liked ? "좋아요 취소" : "좋아요"}
            >
              {liked ? "♥ 좋아요 취소" : "♡ 좋아요"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
