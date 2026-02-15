"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useClearCart } from "@/features/cart/hooks";
import { useCartStore } from "@/features/cart/store";
import { useAuth } from "@/features/auth/store";

export default function OrderCompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId");
  const { userId } = useAuth();
  
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
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="text-center py-12">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">주문이 완료되었습니다!</h1>
          <p className="text-gray-600">
            주문해 주셔서 감사합니다.
          </p>
        </div>

        <div className="border rounded-lg p-6 bg-gray-50 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">주문번호</span>
            <span className="font-semibold text-lg">{orderId}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => router.push(`/my-page/orders/${orderId}`)}
            className="w-full"
            size="lg"
          >
            주문 상세 보기
          </Button>
          <Button
            onClick={() => router.push("/my-page/orders")}
            variant="secondary"
            className="w-full"
          >
            주문 내역 보기
          </Button>
          <Button
            onClick={() => router.push("/products")}
            variant="secondary"
            className="w-full"
          >
            쇼핑 계속하기
          </Button>
        </div>
      </div>
    </div>
  );
}
