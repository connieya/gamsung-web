"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/features/cart/hooks";
import { useCartStore } from "@/features/cart/store";
import { useAuthStore } from "@/features/auth/store";
import { usePlaceOrder } from "@/features/order/hooks";
import { issueOrderNo } from "@/features/order/api";
import { useProductDetail } from "@/features/product/hooks";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Input } from "@/components/ui/Input";
import { PaymentModal } from "@/components/domain/PaymentModal";

export default function OrderNewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = useAuthStore((s) => s.userId);
  const isLoggedIn = !!userId;

  // URL 파라미터에서 productId와 quantity 추출 (바로 구매 시)
  const buyNowProductId = searchParams?.get("productId") ? Number(searchParams.get("productId")) : null;
  const buyNowQuantity = searchParams?.get("quantity") ? Number(searchParams.get("quantity")) : 1;

  // 바로 구매 상품 정보 조회
  const { data: buyNowProduct, isLoading: buyNowProductLoading } = useProductDetail(buyNowProductId);

  // 서버 장바구니 또는 로컬 장바구니
  const { data: serverCart, isLoading: serverCartLoading } = useCart();
  const localCartItems = useCartStore((state) => state.items);
  const getLocalCartTotalAmount = useCartStore((state) => state.getTotalAmount);

  // 주문 상품 목록 결정 (바로 구매 상품이 있으면 그것만, 없으면 장바구니 전체)
  const { items, totalAmount, isLoading } = useMemo(() => {
    if (buyNowProductId) {
      if (buyNowProductLoading) return { items: [], totalAmount: 0, isLoading: true };
      if (!buyNowProduct) return { items: [], totalAmount: 0, isLoading: false };
      
      const item = {
        productId: buyNowProduct.productId,
        productName: buyNowProduct.productName,
        price: buyNowProduct.price,
        quantity: buyNowQuantity,
      };
      return { 
        items: [item], 
        totalAmount: item.price * item.quantity,
        isLoading: false 
      };
    }

    const cart = isLoggedIn 
      ? serverCart 
      : { items: localCartItems, totalAmount: getLocalCartTotalAmount() };
    
    return { 
      items: cart?.items ?? [], 
      totalAmount: cart?.totalAmount ?? 0,
      isLoading: isLoggedIn ? serverCartLoading : false 
    };
  }, [
    buyNowProductId, buyNowProduct, buyNowProductLoading, buyNowQuantity, 
    isLoggedIn, serverCart, serverCartLoading, localCartItems, getLocalCartTotalAmount
  ]);

  const placeOrderMutation = usePlaceOrder();

  // 배송지 정보
  const [recipientName, setRecipientName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  // 결제 모달 상태
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [issuedOrderNo, setIssuedOrderNo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientName || !address || !phone) {
      alert("배송지 정보를 모두 입력해주세요.");
      return;
    }

    if (items.length === 0) {
      alert("주문할 상품이 없습니다.");
      return;
    }

    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      // 현재 페이지 정보를 유지하면서 로그인 페이지로 이동 (나중에 돌아오기 위해)
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (!userId) return;

    // 1) Musinsa-like: 주문번호(orderNo) 선발급
    let orderNoToUse: string | undefined;
    try {
      const issued = await issueOrderNo(userId, { isNewOrderForm: true });
      orderNoToUse = issued.orderNo;
      setIssuedOrderNo(issued.orderNo);
    } catch (e) {
      console.error(e);
      // 선발급 실패 시에도 기존 플로우로 진행(백엔드에서 orderNumber 생성)
    }

    // 주문 생성 API 호출
    placeOrderMutation.mutate(
      {
        orderNo: orderNoToUse,
        couponId: null,
        orderItems: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: (result) => {
          const orderId = result.orderId;
          setCreatedOrderId(orderId);
          // 결제 모달 열기
          setIsPaymentModalOpen(true);
        },
        onError: (error) => {
          console.error(error);
          alert("주문 생성 중 오류가 발생했습니다.");
        },
      }
    );
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <h1 className="text-display font-bold text-brand-black mb-6">주문서 작성</h1>
        <div className="text-center py-12 text-brand-gray">
          주문할 상품이 없습니다.
        </div>
        <Link href="/products">
          <Button className="w-full" size="lg">
            쇼핑 계속하기
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-display font-bold text-brand-black mb-8">주문서 작성</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 주문 상품 목록 */}
        <section className="rounded-xl border border-brand-border bg-brand-white p-6">
          <h2 className="text-title font-semibold text-brand-black mb-4">주문 상품</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between items-center py-3 border-b border-brand-border last:border-0">
                <div className="flex-1">
                  <p className="text-body font-medium text-brand-black">{item.productName}</p>
                  <p className="text-caption text-brand-gray mt-1">
                    {item.price.toLocaleString()}원 × {item.quantity}
                  </p>
                </div>
                <p className="text-title font-semibold text-brand-black min-w-[100px] text-right">
                  {(item.price * item.quantity).toLocaleString()}원
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 배송지 정보 */}
        <section className="rounded-xl border border-brand-border bg-brand-white p-6">
          <h2 className="text-title font-semibold text-brand-black mb-4">배송지 정보</h2>
          <div className="space-y-4">
            <Input
              label="받는 사람 이름"
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="홍길동"
              required
            />
            <Input
              label="주소"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="서울시 강남구 테헤란로 123"
              required
            />
            <Input
              label="전화번호"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-1234-5678"
              required
            />
          </div>
        </section>

        {/* 결제 금액 */}
        <section className="rounded-xl border border-brand-border bg-brand-bg p-6">
          <div className="flex justify-between items-center">
            <span className="text-title font-semibold text-brand-black">총 결제 금액</span>
            <span className="text-display font-bold text-brand-black">
              {totalAmount.toLocaleString()}원
            </span>
          </div>
        </section>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={placeOrderMutation.isPending}
        >
          {placeOrderMutation.isPending ? (
            <>
              <Spinner size="sm" className="mr-2" />
              주문 처리 중...
            </>
          ) : (
            "결제하기"
          )}
        </Button>
      </form>

      {/* 결제 모달 */}
      {createdOrderId && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          orderId={createdOrderId}
          recipientName={recipientName}
          address={address}
          phone={phone}
          totalAmount={totalAmount}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
