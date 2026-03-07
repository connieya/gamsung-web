"use client";

import { Button } from "@/components/ui/Button";
import type { AvailableCoupon, UserCoupon } from "@/features/coupon/types";

function formatDiscount(couponType: string, value: number): string {
  if (couponType === "PERCENTAGE") return `${value}% 할인`;
  return `${new Intl.NumberFormat("ko-KR").format(value)}원 할인`;
}

function formatDate(dateStr: string): string {
  return `~${dateStr.slice(0, 10).replace(/-/g, ".")}`;
}

function typeBadgeLabel(couponType: string): string {
  return couponType === "PERCENTAGE" ? "정률할인" : "정액할인";
}

interface OwnedProps {
  mode: "owned";
  coupon: UserCoupon;
}

interface AvailableProps {
  mode: "available";
  coupon: AvailableCoupon;
  onIssue: (couponId: number) => void;
  isIssuing: boolean;
  isIssued: boolean;
}

type CouponCardProps = OwnedProps | AvailableProps;

export function CouponCard(props: CouponCardProps) {
  const { mode, coupon } = props;

  const statusLabel =
    mode === "owned"
      ? coupon.used
        ? "사용완료"
        : coupon.expired
          ? "만료"
          : "사용가능"
      : null;

  const statusColor =
    mode === "owned"
      ? coupon.used || coupon.expired
        ? "text-brand-gray"
        : "text-green-600"
      : null;

  const isDisabled =
    mode === "owned" ? coupon.used || coupon.expired : false;

  return (
    <div
      className={`rounded-xl border border-brand-border bg-brand-white p-5 ${isDisabled ? "opacity-50" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-block rounded bg-brand-bg px-2 py-0.5 text-caption font-medium text-brand-black">
              {typeBadgeLabel(coupon.couponType)}
            </span>
            <span className="text-title font-bold text-brand-black">
              {formatDiscount(coupon.couponType, coupon.value)}
            </span>
          </div>
          <p className="mt-1.5 truncate text-body text-brand-black">
            {coupon.couponName}
          </p>
          <p className="mt-1 text-caption text-brand-gray">
            {formatDate(
              mode === "owned" ? coupon.expiredAt : coupon.validTo
            )}
          </p>
        </div>

        <div className="shrink-0">
          {mode === "owned" && statusLabel && (
            <span className={`text-caption font-medium ${statusColor}`}>
              {statusLabel}
            </span>
          )}
          {mode === "available" && (
            <Button
              size="sm"
              variant={props.isIssued ? "secondary" : "primary"}
              disabled={props.isIssued || props.isIssuing}
              isLoading={props.isIssuing}
              onClick={() => props.onIssue(coupon.couponId)}
            >
              {props.isIssued ? "발급 완료" : "쿠폰 받기"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
