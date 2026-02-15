"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@/components/ui/Spinner";
import { useAuthStore } from "@/features/auth/store";
import { useOrderDetail } from "@/features/order/hooks";
import { Button } from "@/components/ui/Button";

function getStatusText(status: string) {
  switch (status) {
    case "INIT":
      return "주문 대기";
    case "PAID":
      return "결제 완료";
    case "SHIPPED":
      return "배송 중";
    case "DELIVERED":
      return "배송 완료";
    case "CANCELLED":
      return "주문 취소";
    default:
      return status;
  }
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id ? String(params.id) : null;
  const userId = useAuthStore((s) => s.userId);
  const { data, isLoading, isError } = useOrderDetail(orderId);

  if (!userId) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
        <p className="text-body text-brand-gray">로그인이 필요합니다.</p>
        <Link
          href="/login"
          className="mt-4 inline-block text-body font-medium text-brand-black underline hover:opacity-80"
        >
          로그인
        </Link>
      </div>
    );
  }

  if (orderId == null || isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <p className="text-body text-red-600">해당 주문 정보를 찾을 수 없습니다.</p>
        <Link
          href="/my-page/orders"
          className="mt-4 inline-block text-body text-brand-gray underline hover:text-brand-black"
        >
          주문 내역으로
        </Link>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const finalAmount = data.totalAmount - data.discountAmount;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-display font-bold text-brand-black">주문 상세</h1>
        <Link href="/my-page/orders">
          <Button variant="secondary">목록으로</Button>
        </Link>
      </div>

      {/* 주문 정보 */}
      <section className="rounded-xl border border-brand-border bg-gray-50 p-6 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-brand-gray">주문번호</p>
            <p className="font-semibold mt-1">{data.orderNumber}</p>
          </div>
          <div>
            <p className="text-sm text-brand-gray">주문 상태</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                data.orderStatus === "PAID"
                  ? "bg-green-100 text-green-800"
                  : data.orderStatus === "INIT"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {getStatusText(data.orderStatus)}
            </span>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-brand-gray">주문 일시</p>
            <p className="font-medium mt-1">
              {new Date(data.createdAt).toLocaleString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </section>

      {/* 주문 상품 */}
      <section className="rounded-xl border border-brand-border bg-brand-white p-6 mb-4">
        <h2 className="text-lg font-semibold mb-4">주문 상품</h2>
        <div className="space-y-3">
          {data.items.map((item, index) => (
            <div key={index} className="flex justify-between pb-3 border-b last:border-b-0">
              <div>
                <p className="font-medium">상품 ID: {item.productId}</p>
                <p className="text-sm text-brand-gray">
                  {item.price.toLocaleString()}원 × {item.quantity}개
                </p>
              </div>
              <p className="font-medium">
                {(item.price * item.quantity).toLocaleString()}원
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 결제 정보 */}
      <section className="rounded-xl border border-brand-border bg-gray-50 p-6">
        <h2 className="text-lg font-semibold mb-4">결제 정보</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-brand-gray">상품 금액</span>
            <span>{data.totalAmount.toLocaleString()}원</span>
          </div>
          {data.discountAmount > 0 && (
            <div className="flex justify-between text-red-600">
              <span>할인 금액</span>
              <span>-{data.discountAmount.toLocaleString()}원</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t font-bold text-lg">
            <span>최종 결제 금액</span>
            <span className="text-blue-600">{finalAmount.toLocaleString()}원</span>
          </div>
        </div>
      </section>
    </div>
  );
}
