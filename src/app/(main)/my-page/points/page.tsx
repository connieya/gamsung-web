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
        <p className="text-red-600">포인트 정보를 불러올 수 없습니다.</p>
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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">포인트</h1>
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-500">보유 포인트</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">
          {formatPoint(balance)}
        </p>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">포인트 충전</h2>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <Input
            type="number"
            label="충전 금액 (P)"
            placeholder="1000"
            value={chargeAmount}
            onChange={(e) => setChargeAmount(e.target.value)}
            min={1}
            className="w-40"
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
          <p className="mt-2 text-sm text-red-600">
            {chargePoint.error?.message}
          </p>
        )}
      </div>
      <Link href="/my-page" className="mt-8 inline-block text-gray-600 underline">
        마이페이지로
      </Link>
    </div>
  );
}
