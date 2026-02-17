"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { useProcessPayment } from "@/features/payment/hooks";
import type { PaymentMethod, CardType } from "@/features/payment/types";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  recipientName: string;
  address: string;
  phone: string;
  totalAmount: number;
  onPaymentSuccess: () => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  orderId,
  recipientName,
  address,
  phone,
  totalAmount,
  onPaymentSuccess,
}: PaymentModalProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CARD");
  const [cardType, setCardType] = useState<CardType>("CREDIT");
  const [cardNumber, setCardNumber] = useState("");
  const paymentMutation = useProcessPayment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "CARD" && !cardNumber) {
      alert("카드 번호를 입력해주세요.");
      return;
    }

    paymentMutation.mutate(
      {
        orderId,
        paymentMethod,
        cardType: paymentMethod === "CARD" ? cardType : undefined,
        cardNumber: paymentMethod === "CARD" ? cardNumber : undefined,
      },
      {
        onSuccess: () => {
          onPaymentSuccess();
          router.push(`/order/complete?orderId=${orderId}`);
        },
        onError: (error) => {
          console.error(error);
          alert("결제 처리 중 오류가 발생했습니다.");
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="결제하기" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 주문 정보 */}
        <section className="rounded-xl border border-brand-border bg-brand-bg p-4">
          <h3 className="text-body font-semibold text-brand-black mb-3">주문 정보</h3>
          <div className="space-y-2 text-body">
            <div className="flex justify-between">
              <span className="text-brand-gray">주문번호</span>
              <span className="font-medium text-brand-black">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-gray">받는 사람</span>
              <span className="font-medium text-brand-black">{recipientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-gray">배송지</span>
              <span className="font-medium text-brand-black">{address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-gray">전화번호</span>
              <span className="font-medium text-brand-black">{phone}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-brand-border">
              <span className="text-title font-semibold text-brand-black">총 결제 금액</span>
              <span className="text-title font-semibold text-brand-black">
                {totalAmount.toLocaleString()}원
              </span>
            </div>
          </div>
        </section>

        {/* 결제 수단 선택 */}
        <section className="rounded-xl border border-brand-border bg-brand-white p-4">
          <h3 className="text-body font-semibold text-brand-black mb-4">결제 수단</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="CARD"
                checked={paymentMethod === "CARD"}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
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
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-4 h-4 text-brand-black focus:ring-brand-black"
              />
              <span className="text-body text-brand-black">포인트 결제</span>
            </label>
          </div>
        </section>

        {/* 카드 결제 정보 */}
        {paymentMethod === "CARD" && (
          <section className="rounded-xl border border-brand-border bg-brand-white p-4">
            <h3 className="text-body font-semibold text-brand-black mb-4">카드 정보</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-body font-medium text-brand-black mb-2">
                  카드 종류
                </label>
                <select
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value as CardType)}
                  className="w-full rounded-lg border border-brand-border bg-brand-white px-4 py-3 text-body text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-black"
                >
                  <option value="CREDIT">신용카드</option>
                  <option value="DEBIT">체크카드</option>
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

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
            disabled={paymentMutation.isPending}
          >
            취소
          </Button>
          <Button
            type="submit"
            className="flex-1"
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
        </div>
      </form>
    </Modal>
  );
}
