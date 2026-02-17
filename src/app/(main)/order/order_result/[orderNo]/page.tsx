"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/store";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export default function OrderResultPage() {
  const params = useParams();
  const router = useRouter();
  const userId = useAuthStore((s) => s.userId);
  const orderNo = params?.orderNo as string;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    // 페이지 로드 완료
    setIsLoading(false);
  }, [userId, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="text-center space-y-6">
        {/* 성공 아이콘 */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <div>
          <h1 className="text-display font-bold text-brand-black mb-2">
            주문이 완료되었습니다
          </h1>
          <p className="text-body text-brand-gray">
            주문번호: <span className="font-semibold text-brand-black">{orderNo}</span>
          </p>
        </div>

        <div className="rounded-xl border border-brand-border bg-brand-bg p-6 text-left">
          <h2 className="text-title font-semibold text-brand-black mb-3">주문 정보</h2>
          <div className="space-y-2 text-body text-brand-gray">
            <p>주문하신 상품은 빠르게 배송될 예정입니다.</p>
            <p>주문 내역은 마이페이지에서 확인하실 수 있습니다.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link href="/products" className="flex-1">
            <Button variant="secondary" className="w-full" size="lg">
              쇼핑 계속하기
            </Button>
          </Link>
          <Link href="/orders" className="flex-1">
            <Button className="w-full" size="lg">
              주문 내역 보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
