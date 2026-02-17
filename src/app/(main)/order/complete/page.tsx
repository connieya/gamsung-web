"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useClearCart } from "@/features/cart/hooks";
import { useCartStore } from "@/features/cart/store";
import { useAuthStore } from "@/features/auth/store";

export default function OrderCompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId");
  const userId = useAuthStore((s) => s.userId);
  
  const clearCartMutation = useClearCart();
  const clearLocalCart = useCartStore((state) => state.clearItems);

  useEffect(() => {
    if (!orderId) {
      alert("잘못된 접근입니다.");
      router.push("/");
      return;
    }

    // 결제 완료 후 장바구니 비우기
    if (userId) {
      clearCartMutation.mutate();
    } else {
      clearLocalCart();
    }
  }, [orderId, userId, router, clearCartMutation, clearLocalCart]);

  if (!orderId) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
            <span className="text-5xl text-green-600">✓</span>
          </div>
          <h1 className="text-display-lg font-bold text-brand-black mb-3">
            주문이 완료되었습니다!
          </h1>
          <p className="text-body text-brand-gray">
            주문해 주셔서 감사합니다.
          </p>
        </div>

        <div className="rounded-xl border border-brand-border bg-brand-bg p-6 mb-8 max-w-md mx-auto">
          <div className="flex justify-between items-center">
            <span className="text-body text-brand-gray">주문번호</span>
            <span className="text-title font-semibold text-brand-black">{orderId}</span>
          </div>
        </div>

        <div className="space-y-3 max-w-md mx-auto">
          <Link href={`/my-page/orders/${orderId}`} className="block">
            <Button className="w-full" size="lg">
              주문 상세 보기
            </Button>
          </Link>
          <Link href="/my-page/orders" className="block">
            <Button variant="secondary" className="w-full">
              주문 내역 보기
            </Button>
          </Link>
          <Link href="/products" className="block">
            <Button variant="secondary" className="w-full">
              쇼핑 계속하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
