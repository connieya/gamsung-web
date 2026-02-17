"use client";

import Link from "next/link";

interface BrandCardProps {
  brandName: string;
  brandId?: number;
}

export function BrandCard({ brandName, brandId }: BrandCardProps) {
  // 브랜드 ID가 있으면 브랜드 상세 페이지로, 없으면 브랜드 이름으로 검색
  const href = brandId != null 
    ? `/brands/${brandId}` 
    : `/brands/name/${encodeURIComponent(brandName)}`;

  return (
    <Link
      href={href}
      className="group flex items-center justify-center rounded-lg border border-brand-border bg-brand-white px-6 py-4 text-center transition-[box-shadow,transform] hover:shadow-card-hover hover:-translate-y-0.5"
    >
      <span className="text-body font-medium text-brand-black group-hover:underline">
        {brandName}
      </span>
    </Link>
  );
}
