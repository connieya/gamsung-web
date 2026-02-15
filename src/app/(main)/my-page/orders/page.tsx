"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";
import { useAuthStore } from "@/features/auth/store";
import { useOrders } from "@/features/order/hooks";

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

export default function OrderListPage() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.userId);
  const { data, isLoading, isError } = useOrders();

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

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <p className="text-body text-red-600">주문 목록을 불러올 수 없습니다.</p>
      </div>
    );
  }

  const orders = data?.orders ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-display font-bold text-brand-black mb-8">주문 내역</h1>
      
      {orders.length === 0 ? (
        <div className="mt-8 rounded-xl border border-brand-border bg-brand-white p-8">
          <p className="text-body text-brand-gray text-center">
            주문 내역이 없습니다.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              onClick={() => router.push(`/my-page/orders/${order.orderId}`)}
              className="cursor-pointer rounded-xl border border-brand-border bg-brand-white p-6 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-lg text-brand-black">{order.orderNumber}</p>
                  <p className="text-sm text-brand-gray mt-1">
                    {new Date(order.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.orderStatus === "PAID"
                      ? "bg-green-100 text-green-800"
                      : order.orderStatus === "INIT"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {getStatusText(order.orderStatus)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-brand-border">
                <span className="text-brand-gray">총 금액</span>
                <span className="text-lg font-bold text-blue-600">
                  {order.totalAmount.toLocaleString()}원
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/my-page"
        className="mt-6 inline-block text-body text-brand-gray underline hover:text-brand-black"
      >
        마이페이지로
      </Link>
    </div>
  );
}
