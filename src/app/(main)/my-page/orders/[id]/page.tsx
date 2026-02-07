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
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <p className="text-gray-600">로그인이 필요합니다.</p>
        <Link href="/login" className="mt-4 inline-block text-gray-900 underline">
          로그인
        </Link>
      </div>
    );
  }

  if (orderId == null || isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <p className="text-red-600">해당 주문 정보를 찾을 수 없습니다.</p>
        <Link href="/my-page/orders" className="mt-4 inline-block text-gray-600 underline">
          주문 내역으로
        </Link>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">주문 상세</h1>
      <p className="mt-4 text-gray-500">주문 ID: {orderId}</p>
      <Link href="/my-page/orders" className="mt-4 inline-block text-gray-600 underline">
        주문 내역으로
      </Link>
    </div>
  );
}
