"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useProcessPayment } from "@/features/payment/hooks";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import type { PaymentMethod, PayKind, CardType } from "@/features/payment/types";

const PAY_KIND_MAP: Record<PaymentMethod, PayKind> = {
  CARD: "CARD",
  POINT: "POINT",
  ACCOUNT: "ACCOUNT_TRANSFER",
  SIMPLE_PAY: "KAKAOPAY",
};

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams?.get("orderId");
  const recipientName = searchParams?.get("recipientName");
  const address = searchParams?.get("address");
  const phone = searchParams?.get("phone");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CARD");
  const [payKind, setPayKind] = useState<PayKind>("CARD");
  const [cardType, setCardType] = useState<CardType>("SAMSUNG");
  const [cardNumber, setCardNumber] = useState("");

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setPayKind(PAY_KIND_MAP[method]);
  };

  const paymentMutation = useProcessPayment();

  useEffect(() => {
    if (!orderId) {
      alert("잘못된 접근입니다.");
      router.push("/");
    }
  }, [orderId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId) return;

    if (paymentMethod === "CARD" && !cardNumber) {
      alert("카드 번호를 입력해주세요.");
      return;
    }

    paymentMutation.mutate(
      {
        orderId: Number(orderId),
        paymentMethod,
        payKind,
        cardType: paymentMethod === "CARD" ? cardType : undefined,
        cardNumber: paymentMethod === "CARD" ? cardNumber : undefined,
      },
      {
        onSuccess: () => {
          router.push(`/order/complete?orderId=${orderId}`);
        },
        onError: (error) => {
          console.error(error);
          alert("결제 처리 중 오류가 발생했습니다.");
        },
      }
    );
  };

  if (!orderId) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-display font-bold text-brand-black mb-8">결제하기</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 주문 정보 */}
        <section className="rounded-xl border border-brand-border bg-brand-bg p-6">
          <h2 className="text-title font-semibold text-brand-black mb-4">주문 정보</h2>
          <div className="space-y-3 text-body">
            <div className="flex justify-between">
              <span className="text-brand-gray">주문번호</span>
              <span className="font-medium text-brand-black">{orderId}</span>
            </div>
            {recipientName && (
              <div className="flex justify-between">
                <span className="text-brand-gray">받는 사람</span>
                <span className="font-medium text-brand-black">{recipientName}</span>
              </div>
            )}
            {address && (
              <div className="flex justify-between">
                <span className="text-brand-gray">배송지</span>
                <span className="font-medium text-brand-black">{address}</span>
              </div>
            )}
            {phone && (
              <div className="flex justify-between">
                <span className="text-brand-gray">전화번호</span>
                <span className="font-medium text-brand-black">{phone}</span>
              </div>
            )}
          </div>
        </section>

        {/* 결제 수단 선택 */}
        <section className="rounded-xl border border-brand-border bg-brand-white p-6">
          <h2 className="text-title font-semibold text-brand-black mb-4">결제 수단</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="CARD"
                checked={paymentMethod === "CARD"}
                onChange={(e) => handlePaymentMethodChange(e.target.value as PaymentMethod)}
                className="w-4 h-4 text-brand-black focus:ring-brand-black"
              />
              <span className="text-body text-brand-black">카드 결제</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="POINT"
                checked={paymentMethod === "POINT"}
                onChange={(e) => handlePaymentMethodChange(e.target.value as PaymentMethod)}
                className="w-4 h-4 text-brand-black focus:ring-brand-black"
              />
              <span className="text-body text-brand-black">포인트 결제</span>
            </label>
          </div>
        </section>

        {/* 카드 결제 정보 */}
        {paymentMethod === "CARD" && (
          <section className="rounded-xl border border-brand-border bg-brand-white p-6">
            <h2 className="text-title font-semibold text-brand-black mb-4">카드 정보</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-body font-medium text-brand-black mb-2">
                  카드사
                </label>
                <select
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value as CardType)}
                  className="w-full rounded-lg border border-brand-border bg-brand-white px-4 py-3 text-body text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-black"
                >
                  <option value="SAMSUNG">삼성카드</option>
                  <option value="KB">KB국민카드</option>
                  <option value="HYUNDAI">현대카드</option>
                  <option value="SHINHAN">신한카드</option>
                </select>
              </div>
              <Input
                label="카드 번호"
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234-5678-9012-3456"
                required
              />
            </div>
          </section>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={paymentMutation.isPending}
        >
          {paymentMutation.isPending ? (
            <>
              <Spinner size="sm" className="mr-2" />
              결제 처리 중...
            </>
          ) : (
            "결제하기"
          )}
        </Button>
      </form>
    </div>
  );
}
