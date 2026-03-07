"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { CouponCard } from "@/components/domain/CouponCard";
import { useAuthStore } from "@/features/auth/store";
import {
  useMyCoupons,
  useAvailableCoupons,
  useIssueCoupon,
  useClaimCoupon,
} from "@/features/coupon/hooks";

type Tab = "owned" | "available";

export default function CouponsPage() {
  const userId = useAuthStore((s) => s.userId);
  const [tab, setTab] = useState<Tab>("owned");
  const [search, setSearch] = useState("");
  const [issuingId, setIssuingId] = useState<number | null>(null);
  const [issuedIds, setIssuedIds] = useState<Set<number>>(new Set());
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const myCoupons = useMyCoupons();
  const availableCoupons = useAvailableCoupons();
  const issueCoupon = useIssueCoupon();
  const claimCoupon = useClaimCoupon();

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

  const ownedCoupons = (myCoupons.data?.coupons ?? []).filter(
    (c) => !c.used && !c.expired
  );
  const ownedCount = ownedCoupons.length;
  const availableCount = availableCoupons.data?.coupons?.length ?? 0;

  const isLoading =
    tab === "owned" ? myCoupons.isLoading : availableCoupons.isLoading;
  const isError =
    tab === "owned" ? myCoupons.isError : availableCoupons.isError;

  const filteredOwned = ownedCoupons.filter((c) =>
    c.couponName.includes(search)
  );
  const filteredAvailable = (availableCoupons.data?.coupons ?? []).filter((c) =>
    c.couponName.includes(search)
  );

  const handleIssue = (couponId: number) => {
    setIssuingId(couponId);
    issueCoupon.mutate(couponId, {
      onSuccess: () => {
        setIssuedIds((prev) => new Set(prev).add(couponId));
      },
      onSettled: () => setIssuingId(null),
    });
  };

  const handleClaimModalOpen = () => {
    setCouponCode("");
    claimCoupon.reset();
    setClaimModalOpen(true);
  };

  const handleClaim = () => {
    const trimmed = couponCode.trim();
    if (!trimmed) return;
    claimCoupon.mutate(
      { couponCode: trimmed },
      {
        onSuccess: () => {
          setCouponCode("");
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-display font-bold text-brand-black">쿠폰</h1>

      {/* 탭 + 쿠폰 등록 버튼 */}
      <div className="mt-6 flex items-center justify-between border-b border-brand-border">
        <div className="flex">
          <button
            type="button"
            onClick={() => setTab("owned")}
            className={`px-4 py-3 text-body font-medium transition-colors ${
              tab === "owned"
                ? "border-b-2 border-brand-black text-brand-black"
                : "text-brand-gray hover:text-brand-black"
            }`}
          >
            보유 쿠폰({ownedCount})
          </button>
          <button
            type="button"
            onClick={() => setTab("available")}
            className={`px-4 py-3 text-body font-medium transition-colors ${
              tab === "available"
                ? "border-b-2 border-brand-black text-brand-black"
                : "text-brand-gray hover:text-brand-black"
            }`}
          >
            쿠폰 받기({availableCount})
          </button>
        </div>
        <Button variant="secondary" size="sm" onClick={handleClaimModalOpen}>
          쿠폰 등록
        </Button>
      </div>

      {/* 검색창 */}
      <div className="mt-4">
        <Input
          placeholder="쿠폰명을 검색하세요"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 콘텐츠 */}
      {isLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : isError ? (
        <div className="py-16 text-center">
          <p className="text-body text-red-600">
            쿠폰 정보를 불러올 수 없습니다.
          </p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {tab === "owned" &&
            (filteredOwned.length === 0 ? (
              <p className="py-16 text-center text-body text-brand-gray">
                보유한 쿠폰이 없습니다.
              </p>
            ) : (
              filteredOwned.map((coupon, index) => (
                <CouponCard
                  key={`${coupon.couponName}-${index}`}
                  mode="owned"
                  coupon={coupon}
                />
              ))
            ))}

          {tab === "available" &&
            (filteredAvailable.length === 0 ? (
              <p className="py-16 text-center text-body text-brand-gray">
                받을 수 있는 쿠폰이 없습니다.
              </p>
            ) : (
              filteredAvailable.map((coupon) => (
                <CouponCard
                  key={coupon.couponId}
                  mode="available"
                  coupon={coupon}
                  onIssue={handleIssue}
                  isIssuing={issuingId === coupon.couponId}
                  isIssued={issuedIds.has(coupon.couponId)}
                />
              ))
            ))}
        </div>
      )}

      <Link
        href="/my-page"
        className="mt-8 inline-block text-body text-brand-gray underline hover:text-brand-black"
      >
        마이페이지로
      </Link>

      {/* 쿠폰 등록 모달 */}
      <Modal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        title="쿠폰 등록"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <Input
            label="쿠폰 코드"
            placeholder="쿠폰 코드를 입력하세요"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          {claimCoupon.isError && (
            <p className="text-caption text-red-600">
              {claimCoupon.error?.message ?? "쿠폰 등록에 실패했습니다."}
            </p>
          )}
          {claimCoupon.isSuccess && (
            <p className="text-caption text-green-600">
              쿠폰이 등록되었습니다.
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setClaimModalOpen(false)}
            >
              닫기
            </Button>
            <Button
              size="sm"
              onClick={handleClaim}
              disabled={!couponCode.trim() || claimCoupon.isPending}
              isLoading={claimCoupon.isPending}
            >
              등록
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
