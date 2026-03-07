"use client";

import Link from "next/link";
import { useAuthStore } from "@/features/auth/store";

const MENU_ITEMS = [
  { href: "/my-page/orders", label: "주문 내역", desc: "주문·배송 조회" },
  { href: "/my-page/likes", label: "좋아요 목록", desc: "저장한 상품" },
  { href: "/my-page/points", label: "포인트", desc: "잔액·충전" },
  { href: "/my-page/coupons", label: "쿠폰", desc: "보유·발급" },
];

export default function MyPage() {
  const userId = useAuthStore((s) => s.userId);

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-display font-bold text-brand-black">마이페이지</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {MENU_ITEMS.map(({ href, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col rounded-xl border border-brand-border bg-brand-white p-6 transition-[box-shadow] hover:shadow-card-hover"
          >
            <span className="text-title font-semibold text-brand-black group-hover:underline">
              {label}
            </span>
            <span className="mt-1 text-caption text-brand-gray">{desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
