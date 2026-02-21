"use client";

import Link from "next/link";
import { useOrderCheckout } from "@/features/order/hooks";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Input } from "@/components/ui/Input";
import { PaymentModal } from "@/components/domain/PaymentModal";
import { PaymentMethodSelector } from "@/components/domain/PaymentMethodSelector";

export default function OrderFormPage() {
  const {
    isLoading,
    isSubmitting,
    orderFormData,
    recipientName,
    setRecipientName,
    address,
    setAddress,
    phone,
    setPhone,
    selectedPayment,
    setSelectedPayment,
    selectedSubPayment,
    setSelectedSubPayment,
    resolvedPayKind,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    orderNo,
    orderKey,
    paymentUrl,
    handleSubmit,
    handlePaymentSuccess,
  } = useOrderCheckout();

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
        <PaymentMethodSelector
          selectedPayment={selectedPayment}
          selectedSubPayment={selectedSubPayment}
          onPaymentChange={setSelectedPayment}
          onSubPaymentChange={setSelectedSubPayment}
        />

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
          payKind={resolvedPayKind}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
