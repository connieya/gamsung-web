"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { useBrandList } from "@/features/brand/hooks";

export default function BrandListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError, error } = useBrandList();

  const brands = useMemo(() => {
    const items = data?.brands ?? [];
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return items;

    return items.filter((brand) => brand.name.toLowerCase().includes(keyword));
  }, [data?.brands, searchTerm]);

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
        <p className="text-body text-red-600">
          {error?.message ?? "브랜드를 불러올 수 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-brand-border bg-brand-white p-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-display font-bold text-brand-black">브랜드</h1>
          <p className="mt-2 text-body text-brand-gray">
            백엔드에 등록된 브랜드를 한 곳에서 탐색할 수 있어요.
          </p>
        </div>
        <p className="text-caption text-brand-gray">총 {data?.brands.length ?? 0}개</p>
      </div>

      <div className="mt-6 rounded-2xl border border-brand-border bg-brand-white p-5">
        <label className="block text-caption font-medium text-brand-gray" htmlFor="brand-search">
          브랜드 검색
        </label>
        <input
          id="brand-search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="브랜드명을 입력하세요"
          className="mt-2 w-full rounded-full border border-brand-border bg-brand-white px-4 py-3 text-body outline-none transition-colors placeholder:text-brand-gray focus:border-brand-black"
        />
      </div>

      {brands.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-brand-border bg-brand-white px-6 py-16 text-center">
          <p className="text-body text-brand-gray">검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.id}`}
              className="group rounded-2xl border border-brand-border bg-brand-white p-6 transition-[box-shadow] hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-title font-semibold text-brand-black group-hover:underline">
                    {brand.name}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-body text-brand-gray">
                    {brand.description || "브랜드 소개를 확인해보세요."}
                  </p>
                </div>
                <span className="text-brand-gray transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
