"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/store";
import { getOrderForm, issueOrderNo, readyOrder, createPaymentSession } from "@/features/order/api";
import type { OrderFormResponse } from "@/features/order/types";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Input } from "@/components/ui/Input";
import { PaymentModal } from "@/components/domain/PaymentModal";
import { useOrderFlowStore } from "@/features/order/store";

export default function OrderFormPage() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.userId);
  const isLoggedIn = !!userId;
  const [orderFormData, setOrderFormData] = useState<OrderFormResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 배송지 정보
  const [recipientName, setRecipientName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  // 결제 모달 상태
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [orderNo, setOrderNo] = useState<string | null>(null);
  const [orderKey, setOrderKey] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    if (!userId || fetchedRef.current) {
      return;
    }
    fetchedRef.current = true;

    // 원샷 소비: 스토어에서 직접 읽고 즉시 클리어
    const { selectedCartItemIds } = useOrderFlowStore.getState();
    useOrderFlowStore.getState().clearSelectedCartItemIds();

    const timestamp = Date.now();
    getOrderForm(userId, selectedCartItemIds, timestamp)
      .then((data) => {
        setOrderFormData(data);
        if (data.member.name) {
          setRecipientName(data.member.name);
        }
      })
      .catch((error) => {
        console.error("주문서 로드 실패:", error);
        alert("주문서를 불러오는데 실패했습니다.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isLoggedIn, userId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientName || !address || !phone) {
      alert("배송지 정보를 모두 입력해주세요.");
      return;
    }

    if (!orderFormData || !userId) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. 주문번호 발급
      const issueResult = await issueOrderNo(userId, { isNewOrderForm: true });
      setOrderNo(issueResult.orderNo);
      setOrderKey(issueResult.orderKey);

      const orderItems = orderFormData.cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      // 2. ready - 주문 전체 정보를 서버에 등록
      await readyOrder(userId, issueResult.orderNo, {
        paymentMethod: "CARD",
        payKind: "CARD",
        orderKey: issueResult.orderKey,
        orderItems,
        couponId: null,
      });

      // 3. payment-session - PG 결제 URL 확보
      const sessionResult = await createPaymentSession(userId, {
        orderNo: issueResult.orderNo,
        orderKey: issueResult.orderKey,
        paymentMethod: "CARD",
        payKind: "CARD",
        orderItems,
        cardType: "SAMSUNG",
        cardNumber: "1234-5678-9012-3456",
        couponId: null,
      });

      setPaymentUrl(sessionResult.paymentUrl);

      // 4. 결제 모달 열기
      setIsPaymentModalOpen(true);
    } catch (error) {
      console.error("결제 준비 실패:", error);
      alert("결제 준비 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    if (orderNo) {
      router.push(`/order/order_result/${orderNo}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!orderFormData) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <h1 className="text-display font-bold text-brand-black mb-6">주문서 작성</h1>
        <div className="text-center py-12 text-brand-gray">
          주문 정보를 불러올 수 없습니다.
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
        {/* 주문 상품 */}
        <section className="rounded-xl border border-brand-border bg-brand-white p-6">
          <h2 className="text-title font-semibold text-brand-black mb-4">주문 상품</h2>
          <div className="space-y-4">
            {orderFormData.cartItems.map((item) => (
              <div key={item.cartId} className="flex justify-between items-center py-3 border-b border-brand-border last:border-0">
                <div className="flex-1">
                  <p className="text-body font-medium text-brand-black">
                    {item.productName}
                  </p>
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
              {orderFormData.totalAmount.toLocaleString()}원
            </span>
          </div>
        </section>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" className="mr-2" />
              결제 준비 중...
            </>
          ) : (
            "결제하기"
          )}
        </Button>
      </form>

      {/* 결제 모달 */}
      {orderNo && orderKey && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          orderNo={orderNo}
          recipientName={recipientName}
          address={address}
          phone={phone}
          totalAmount={orderFormData.totalAmount}
          paymentUrl={paymentUrl}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
