"use client";

import Link from "next/link";
import { Spinner } from "@/components/ui/Spinner";
import { useAuthStore } from "@/features/auth/store";
import { useOrders } from "@/features/order/hooks";

export default function OrderListPage() {
  const userId = useAuthStore((s) => s.userId);
  const { data, isLoading, isError } = useOrders();

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

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <p className="text-red-600">주문 목록을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">주문 내역</h1>
      <p className="mt-4 text-gray-500">
        주문 내역이 없습니다. (백엔드 API가 목록 데이터를 아직 반환하지 않을 수 있습니다.)
      </p>
      <Link href="/my-page" className="mt-4 inline-block text-gray-600 underline">
        마이페이지로
      </Link>
    </div>
  );
}
