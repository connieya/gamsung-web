"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import type { PayKind } from "@/features/payment/types";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNo: string;
  recipientName: string;
  address: string;
  phone: string;
  totalAmount: number;
  paymentUrl: string | null;
  payKind: PayKind;
  onPaymentSuccess: () => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  orderNo,
  recipientName,
  address,
  phone,
  totalAmount,
  paymentUrl,
  payKind,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // 2초 대기 (결제 처리 시뮬레이션)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // 자동 성공 처리
    setIsProcessing(false);
    onPaymentSuccess();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="결제하기" size="lg">
      <div className="space-y-6">
        {/* 주문 정보 */}
        <section className="rounded-xl border border-brand-border bg-brand-bg p-4">
          <h3 className="text-body font-semibold text-brand-black mb-3">주문 정보</h3>
          <div className="space-y-2 text-body">
            <div className="flex justify-between">
              <span className="text-brand-gray">주문번호</span>
              <span className="font-medium text-brand-black">{orderNo}</span>
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

        {/* 결제 진행 - 결제사별 분기 */}
        {payKind === "KAKAOPAY" ? (
          <section className="rounded-xl overflow-hidden">
            <div className="flex flex-col items-center gap-4 p-8" style={{ backgroundColor: "#FEE500" }}>
              <span className="text-xl font-bold text-black">카카오페이</span>
              <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-white">
                <span className="text-caption text-brand-gray">QR Code</span>
              </div>
              <p className="text-body font-medium text-black/80">
                카카오톡에서 결제를 완료해주세요
              </p>
              <p className="text-title font-semibold text-black">
                결제 금액: {totalAmount.toLocaleString()}원
              </p>
            </div>
          </section>
        ) : payKind === "TOSSPAY" ? (
          <section className="rounded-xl overflow-hidden">
            <div className="flex flex-col items-center gap-4 p-8" style={{ backgroundColor: "#0064FF" }}>
              <span className="text-xl font-bold text-white">토스페이</span>
              <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-white">
                <span className="text-caption text-brand-gray">QR Code</span>
              </div>
              <p className="text-body font-medium text-white/80">
                토스 앱에서 결제를 완료해주세요
              </p>
              <p className="text-title font-semibold text-white">
                결제 금액: {totalAmount.toLocaleString()}원
              </p>
            </div>
          </section>
        ) : (
          <section className="rounded-xl border border-brand-border bg-brand-white p-4">
            <h3 className="text-body font-semibold text-brand-black mb-2">결제 진행</h3>
            <p className="text-caption text-brand-gray">
              &quot;결제하기&quot; 버튼을 클릭하면 결제가 자동으로 완료됩니다.
            </p>
            {paymentUrl && (
              <p className="text-caption text-brand-gray mt-2">
                결제 URL: {paymentUrl}
              </p>
            )}
          </section>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
            disabled={isProcessing}
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={handlePayment}
            className="flex-1"
            size="lg"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Spinner size="sm" className="mr-2" />
                결제 처리 중...
              </>
            ) : payKind === "KAKAOPAY" || payKind === "TOSSPAY" ? (
              "결제완료 확인"
            ) : (
              "결제하기"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
