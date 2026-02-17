"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useProductDetail } from "@/features/product/hooks";
import { useAuthStore } from "@/features/auth/store";
import { useAddLike, useRemoveLike, useMyLikes } from "@/features/likes/hooks";
import { useAddToCart } from "@/features/cart/hooks";
import { useCartStore } from "@/features/cart/store";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR").format(price) + "원";
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id ? Number(params.id) : null;
  const userId = useAuthStore((s) => s.userId);
  const { data, isLoading, isError, error } = useProductDetail(productId);
  const { data: likesData, isLoading: likesLoading } = useMyLikes();
  const likedIds = new Set(
    likesData?.likedProducts?.map((p) => Number(p.productId)) ?? []
  );
  const liked =
    productId != null &&
    likedIds.has(productId);
  const likesReady = !userId || !likesLoading;
  const addLike = useAddLike();
  const removeLike = useRemoveLike();
  const addToCartMutation = useAddToCart();
  const addToLocalCart = useCartStore((s) => s.addItem);

  if (productId == null || isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <p className="text-body text-red-600">
          {error?.message ?? "해당 상품을 찾을 수 없습니다."}
        </p>
        <Link
          href="/products"
          className="mt-4 inline-block text-body text-brand-gray underline hover:text-brand-black"
        >
          상품 목록으로
        </Link>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
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

  const handleAddToCart = () => {
    if (!data) return;
    
    if (userId) {
      addToCartMutation.mutate(
        { productId, quantity: 1 },
        {
          onSuccess: () => {
            if (confirm("장바구니에 담았습니다. 장바구니로 이동하시겠습니까?")) {
              router.push("/orders/cart");
            }
          },
        }
      );
    } else {
      addToLocalCart({
        productId,
        productName: data.productName,
        price: data.price,
        quantity: 1,
      });
      if (confirm("장바구니에 담았습니다. 장바구니로 이동하시겠습니까?")) {
        router.push("/orders/cart");
      }
    }
  };

  const handleBuyNow = () => {
    if (!data) return;

    if (userId) {
      addToCartMutation.mutate(
        { productId, quantity: 1 },
        {
          onSuccess: (cart) => {
            const addedItem = cart.items.find((item) => item.productId === productId);
            if (addedItem?.itemId) {
              router.push(`/order/order-form?cartItemIds=${addedItem.itemId}`);
            }
          },
          onError: (error) => {
            console.error(error);
            alert("구매하기 처리 중 오류가 발생했습니다.");
          },
        }
      );
    } else {
      alert("로그인이 필요합니다.");
      router.push("/login");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        <div className="aspect-square overflow-hidden rounded-xl bg-[#f0f0f0]">
          {data.imageUrl && (
            <img
              src={data.imageUrl}
              alt={data.productName}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div>
          <p className="text-caption text-brand-gray">{data.brandName}</p>
          <h1 className="mt-2 text-display font-bold text-brand-black">
            {data.productName}
          </h1>
          <p className="mt-4 text-title font-semibold text-brand-black">
            {formatPrice(data.price)}
          </p>
          <div className="mt-4 flex items-center gap-4 text-body text-brand-gray">
            <span>♥ {data.likeCount ?? 0}</span>
            {data.rank != null && <span>랭크 #{data.rank}</span>}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="primary"
              onClick={handleBuyNow}
              disabled={addToCartMutation.isPending}
              size="lg"
              className="flex-1"
            >
              {addToCartMutation.isPending ? "처리 중..." : "바로 구매하기"}
            </Button>
            <Button
              variant="secondary"
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending}
              size="lg"
              className="flex-1"
            >
              {addToCartMutation.isPending ? "담는 중..." : "🛒 장바구니 담기"}
            </Button>
          </div>
          <div className="mt-4 flex gap-3">
            <Button
              variant={likesReady && liked ? "secondary" : "ghost"}
              onClick={handleLike}
              disabled={userId != null && !likesReady}
              aria-label={
                !likesReady ? "확인 중" : liked ? "좋아요 취소" : "좋아요"
              }
            >
              {!likesReady
                ? "♡ 확인 중..."
                : liked
                  ? "♥ 좋아요 취소"
                  : "♡ 좋아요"}
            </Button>
            <Link href="/products" className="flex-1">
              <Button variant="ghost" className="w-full">
                목록으로
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
