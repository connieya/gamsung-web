"use client";

import Link from "next/link";
import { useAuthStore } from "@/features/auth/store";

export default function MyPage() {
  const userId = useAuthStore((s) => s.userId);

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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
      <nav className="mt-6 flex flex-col gap-2">
        <Link
          href="/my-page/orders"
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50"
        >
          주문 내역
        </Link>
        <Link
          href="/my-page/likes"
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50"
        >
          좋아요 목록
        </Link>
        <Link
          href="/my-page/points"
          className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50"
        >
          포인트
        </Link>
      </nav>
    </div>
  );
}
