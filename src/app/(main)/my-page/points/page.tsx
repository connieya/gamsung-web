"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { useAuthStore } from "@/features/auth/store";
import { usePoint, useChargePoint } from "@/features/point/hooks";

function formatPoint(value: number): string {
  return new Intl.NumberFormat("ko-KR").format(value) + "P";
}

export default function PointsPage() {
  const userId = useAuthStore((s) => s.userId);
  const [chargeAmount, setChargeAmount] = useState("");
  const { data, isLoading, isError } = usePoint();
  const chargePoint = useChargePoint();

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
        <p className="text-body text-red-600">포인트 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const balance = data?.value ?? 0;
  const handleCharge = () => {
    const value = Number(chargeAmount);
    if (Number.isNaN(value) || value <= 0) return;
    chargePoint.mutate(
      { value },
      {
        onSuccess: () => setChargeAmount(""),
      }
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-display font-bold text-brand-black">포인트</h1>
      <div className="mt-8 rounded-xl border border-brand-border bg-brand-white p-8">
        <p className="text-body text-brand-gray">보유 포인트</p>
        <p className="mt-2 text-display font-bold text-brand-black">
          {formatPoint(balance)}
        </p>
      </div>
      <div className="mt-10">
        <h2 className="text-title font-semibold text-brand-black">포인트 충전</h2>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <Input
            type="number"
            label="충전 금액 (P)"
            placeholder="1000"
            value={chargeAmount}
            onChange={(e) => setChargeAmount(e.target.value)}
            min={1}
            className="w-44"
          />
          <Button
            onClick={handleCharge}
            disabled={chargePoint.isPending || !chargeAmount}
            isLoading={chargePoint.isPending}
          >
            충전
          </Button>
        </div>
        {chargePoint.isError && (
          <p className="mt-2 text-caption text-red-600">
            {chargePoint.error?.message}
          </p>
        )}
      </div>
      <Link
        href="/my-page"
        className="mt-8 inline-block text-body text-brand-gray underline hover:text-brand-black"
      >
        마이페이지로
      </Link>
    </div>
  );
}
