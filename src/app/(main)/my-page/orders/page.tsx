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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-display font-bold text-brand-black">주문 내역</h1>
      <div className="mt-8 rounded-xl border border-brand-border bg-brand-white p-8">
        <p className="text-body text-brand-gray">
          주문 내역이 없습니다. (백엔드 API가 목록 데이터를 아직 반환하지 않을 수 있습니다.)
        </p>
      </div>
      <Link
        href="/my-page"
        className="mt-6 inline-block text-body text-brand-gray underline hover:text-brand-black"
      >
        마이페이지로
      </Link>
    </div>
  );
}
