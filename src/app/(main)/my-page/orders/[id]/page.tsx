"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@/components/ui/Spinner";
import { useAuthStore } from "@/features/auth/store";
import { useOrderDetail } from "@/features/order/hooks";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id ? Number(params.id) : null;
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-display font-bold text-brand-black">주문 상세</h1>
      <div className="mt-8 rounded-xl border border-brand-border bg-brand-white p-8">
        <p className="text-body text-brand-gray">주문 ID: {orderId}</p>
      </div>
      <Link
        href="/my-page/orders"
        className="mt-6 inline-block text-body text-brand-gray underline hover:text-brand-black"
      >
        주문 내역으로
      </Link>
    </div>
  );
}
