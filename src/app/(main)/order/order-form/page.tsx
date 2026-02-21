"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/store";
import { getOrderForm, issueOrderNo, readyOrder, createPaymentSession } from "@/features/order/api";
import type { OrderFormResponse } from "@/features/order/types";
import type { PaymentMethod, PayKind } from "@/features/payment/types";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Input } from "@/components/ui/Input";
import { PaymentModal } from "@/components/domain/PaymentModal";
import { useOrderFlowStore } from "@/features/order/store";

type MainPaymentOption = "MUSINSA_MONEY" | "MUSINSA_PAY" | "TOSSPAY" | "KAKAOPAY" | "PAYCO" | "OTHER";
type SubPaymentOption = "CARD" | "MOBILE" | "VIRTUAL_ACCOUNT" | "SAMSUNG_PAY";

const MAIN_PAYMENT_OPTIONS: { value: MainPaymentOption; label: string }[] = [
  { value: "MUSINSA_MONEY", label: "무신사머니" },
  { value: "MUSINSA_PAY", label: "무신사페이" },
  { value: "TOSSPAY", label: "토스페이" },
  { value: "KAKAOPAY", label: "카카오페이" },
  { value: "PAYCO", label: "페이코" },
  { value: "OTHER", label: "기타 결제" },
];

const SUB_PAYMENT_OPTIONS: { value: SubPaymentOption; label: string }[] = [
  { value: "CARD", label: "카드" },
  { value: "MOBILE", label: "휴대폰" },
  { value: "VIRTUAL_ACCOUNT", label: "가상계좌" },
  { value: "SAMSUNG_PAY", label: "삼성페이" },
];

function resolvePayment(
  main: MainPaymentOption,
  sub: SubPaymentOption
): { paymentMethod: PaymentMethod; payKind: PayKind } {
  switch (main) {
    case "MUSINSA_MONEY":
      return { paymentMethod: "POINT", payKind: "POINT" };
    case "MUSINSA_PAY":
      return { paymentMethod: "SIMPLE_PAY", payKind: "MUSINSA_PAY" };
    case "TOSSPAY":
      return { paymentMethod: "SIMPLE_PAY", payKind: "TOSSPAY" };
    case "KAKAOPAY":
      return { paymentMethod: "SIMPLE_PAY", payKind: "KAKAOPAY" };
    case "PAYCO":
      return { paymentMethod: "SIMPLE_PAY", payKind: "PAYCO" };
    case "OTHER":
      switch (sub) {
        case "CARD":
          return { paymentMethod: "CARD", payKind: "CARD" };
        case "MOBILE":
          return { paymentMethod: "CARD", payKind: "MOBILE" };
        case "VIRTUAL_ACCOUNT":
          return { paymentMethod: "ACCOUNT", payKind: "VIRTUAL_ACCOUNT" };
        case "SAMSUNG_PAY":
          return { paymentMethod: "SIMPLE_PAY", payKind: "SAMSUNG_PAY" };
      }
  }
}

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

  // 결제 수단 선택
  const [selectedPayment, setSelectedPayment] = useState<MainPaymentOption>("MUSINSA_PAY");
  const [selectedSubPayment, setSelectedSubPayment] = useState<SubPaymentOption>("CARD");

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
        if (data.member.userId) {
          setRecipientName(data.member.userId);
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

      const { paymentMethod, payKind } = resolvePayment(selectedPayment, selectedSubPayment);

      // 2. ready - 주문 전체 정보를 서버에 등록
      await readyOrder(userId, issueResult.orderNo, {
        paymentMethod,
        payKind,
        orderKey: issueResult.orderKey,
        orderItems,
        couponId: null,
      });

      // 3. payment-session - PG 결제 URL 확보
      const sessionResult = await createPaymentSession(userId, {
        orderNo: issueResult.orderNo,
        orderKey: issueResult.orderKey,
        paymentMethod,
        payKind,
        orderItems,
        ...(payKind === "CARD" && {
          cardType: "SAMSUNG" as const,
          cardNumber: "1234-5678-9012-3456",
        }),
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

        {/* 결제 수단 */}
        <section className="rounded-xl border border-brand-border bg-brand-white p-6">
          <h2 className="text-title font-semibold text-brand-black mb-4">결제 수단</h2>
          <div className="space-y-3">
            {MAIN_PAYMENT_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 cursor-pointer rounded-lg border px-4 py-3 transition-colors ${
                  selectedPayment === option.value
                    ? "border-brand-black bg-brand-bg"
                    : "border-brand-border hover:border-brand-gray"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.value}
                  checked={selectedPayment === option.value}
                  onChange={() => setSelectedPayment(option.value)}
                  className="h-4 w-4 accent-brand-black"
                />
                <span className="text-body font-medium text-brand-black">
                  {option.label}
                </span>
              </label>
            ))}
          </div>

          {/* 기타 결제 하위 옵션 */}
          {selectedPayment === "OTHER" && (
            <div className="mt-3 ml-7 grid grid-cols-2 gap-2 rounded-lg border border-brand-border bg-brand-bg p-4">
              {SUB_PAYMENT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-2 cursor-pointer rounded-md border px-3 py-2 transition-colors ${
                    selectedSubPayment === option.value
                      ? "border-brand-black bg-brand-white"
                      : "border-transparent hover:border-brand-gray"
                  }`}
                >
                  <input
                    type="radio"
                    name="subPaymentMethod"
                    value={option.value}
                    checked={selectedSubPayment === option.value}
                    onChange={() => setSelectedSubPayment(option.value)}
                    className="h-3.5 w-3.5 accent-brand-black"
                  />
                  <span className="text-caption font-medium text-brand-black">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          )}
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
          payKind={resolvePayment(selectedPayment, selectedSubPayment).payKind}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
