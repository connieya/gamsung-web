"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProcessPayment } from "@/features/payment/hooks";
import { Button } from "@/components/ui/Button";
import type { PaymentMethod, CardType } from "@/features/payment/types";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const orderId = searchParams?.get("orderId");
  const recipientName = searchParams?.get("recipientName");
  const address = searchParams?.get("address");
  const phone = searchParams?.get("phone");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CARD");
  const [cardType, setCardType] = useState<CardType>("CREDIT");
  const [cardNumber, setCardNumber] = useState("");

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
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">결제하기</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 주문 정보 */}
        <section className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-3">주문 정보</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">주문번호</span>
              <span className="font-medium">{orderId}</span>
            </div>
            {recipientName && (
              <div className="flex justify-between">
                <span className="text-gray-600">받는 사람</span>
                <span className="font-medium">{recipientName}</span>
              </div>
            )}
            {address && (
              <div className="flex justify-between">
                <span className="text-gray-600">배송지</span>
                <span className="font-medium">{address}</span>
              </div>
            )}
            {phone && (
              <div className="flex justify-between">
                <span className="text-gray-600">전화번호</span>
                <span className="font-medium">{phone}</span>
              </div>
            )}
          </div>
        </section>

        {/* 결제 수단 선택 */}
        <section className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">결제 수단</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="CARD"
                checked={paymentMethod === "CARD"}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              />
              <span>카드 결제</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="POINT"
                checked={paymentMethod === "POINT"}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              />
              <span>포인트 결제</span>
            </label>
          </div>
        </section>

        {/* 카드 결제 정보 */}
        {paymentMethod === "CARD" && (
          <section className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">카드 정보</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  카드 종류
                </label>
                <select
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value as CardType)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="CREDIT">신용카드</option>
                  <option value="DEBIT">체크카드</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  카드 번호
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="1234-5678-9012-3456"
                  required
                />
              </div>
            </div>
          </section>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={paymentMutation.isPending}
        >
          {paymentMutation.isPending ? "결제 처리 중..." : "결제하기"}
        </Button>
      </form>
    </div>
  );
}
