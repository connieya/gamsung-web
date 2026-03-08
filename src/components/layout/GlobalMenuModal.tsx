"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useBrandList } from "@/features/brand/hooks";
import { useCategoryTree } from "@/features/category/hooks";
import { Spinner } from "@/components/ui/Spinner";

type MenuTab = "category" | "brand";

interface GlobalMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalMenuModal({ isOpen, onClose }: GlobalMenuModalProps) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<MenuTab>("category");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const shouldLoadBrands = isOpen && selectedTab === "brand";

  const { data: categoryData, isLoading: categoryLoading } = useCategoryTree();
  const {
    data: brandData,
    isLoading: brandLoading,
    isError: brandError,
    error: brandErrorDetail,
  } = useBrandList(shouldLoadBrands);
  const categories = useMemo(
    () => categoryData?.categories ?? [],
    [categoryData?.categories]
  );
  const brands = useMemo(() => brandData?.brands ?? [], [brandData?.brands]);

  // 카테고리 로드 후 첫 번째 항목 자동 선택
  useEffect(() => {
    if (selectedCategoryId === null && categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const filteredBrands = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return brands;
    return brands.filter((brand) =>
      brand.name.toLowerCase().includes(normalizedSearch)
    );
  }, [brands, searchTerm]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId),
    [categories, selectedCategoryId]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/45" onClick={onClose}>
      <div
        className="absolute inset-y-0 left-0 flex w-full max-w-6xl flex-col bg-brand-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-brand-border px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedTab("category")}
              className={`rounded-full px-4 py-2 text-body font-semibold transition-colors ${
                selectedTab === "category"
                  ? "bg-brand-black text-brand-white"
                  : "bg-brand-bg text-brand-gray hover:text-brand-black"
              }`}
            >
              카테고리
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab("brand")}
              className={`rounded-full px-4 py-2 text-body font-semibold transition-colors ${
                selectedTab === "brand"
                  ? "bg-brand-black text-brand-white"
                  : "bg-brand-bg text-brand-gray hover:text-brand-black"
              }`}
            >
              브랜드
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-2 text-body text-brand-gray transition-colors hover:bg-brand-bg hover:text-brand-black"
            aria-label="메뉴 닫기"
          >
            ✕
          </button>
        </div>

        <div className="flex min-h-0 flex-1">
          {selectedTab === "category" ? (
            categoryLoading ? (
              <div className="flex flex-1 items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : categories.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-body text-brand-gray">카테고리가 없습니다.</p>
              </div>
            ) : (
              <>
                <aside className="w-52 shrink-0 overflow-y-auto border-r border-brand-border bg-[#fafafa] px-2 py-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategoryId(category.id)}
                      className={`flex w-full items-center rounded-lg px-4 py-3 text-left text-body transition-colors ${
                        selectedCategoryId === category.id
                          ? "bg-brand-black text-brand-white"
                          : "text-brand-black hover:bg-brand-bg"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </aside>
                <section className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
                  <h3 className="text-display font-bold text-brand-black">
                    {selectedCategory?.name ?? "카테고리"}
                  </h3>
                  <p className="mt-2 text-body text-brand-gray">
                    카테고리를 선택하여 상품을 탐색할 수 있어요.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {/* 전체 보기 */}
                    {selectedCategory && (
                      <button
                        key={`all-${selectedCategory.id}`}
                        type="button"
                        onClick={() => {
                          router.push(`/category/${selectedCategory.id}/goods`);
                          onClose();
                        }}
                        className="rounded-lg border border-brand-black bg-brand-black px-4 py-4 text-left text-body font-medium text-brand-white transition-colors hover:opacity-90"
                      >
                        전체 보기
                      </button>
                    )}
                    {(selectedCategory?.children ?? []).map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => {
                          router.push(`/category/${child.id}/goods`);
                          onClose();
                        }}
                        className="rounded-lg border border-brand-border bg-brand-white px-4 py-4 text-left text-body font-medium text-brand-black transition-colors hover:bg-brand-bg"
                      >
                        {child.name}
                      </button>
                    ))}
                    {(selectedCategory?.children ?? []).length === 0 && !selectedCategory && (
                      <p className="col-span-full text-body text-brand-gray">
                        하위 카테고리가 없습니다.
                      </p>
                    )}
                  </div>
                </section>
              </>
            )
          ) : (
            <>
              <section className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 className="text-display font-bold text-brand-black">
                      브랜드 탐색
                    </h3>
                    <p className="mt-1 text-body text-brand-gray">
                      등록된 브랜드를 검색하고 바로 상세 페이지로 이동할 수 있어요.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-caption text-brand-gray">
                      결과 {filteredBrands.length}개
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        router.push("/brands");
                        onClose();
                      }}
                      className="rounded-full border border-brand-border px-4 py-2 text-caption font-medium text-brand-black transition-colors hover:bg-brand-bg"
                    >
                      전체 브랜드 보기
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="브랜드 검색"
                    className="w-full rounded-full border border-brand-border bg-brand-white px-4 py-3 text-body outline-none ring-0 transition-colors placeholder:text-brand-gray focus:border-brand-black"
                    aria-label="브랜드 검색"
                  />
                </div>
                {brandLoading ? (
                  <div className="flex min-h-[240px] items-center justify-center">
                    <Spinner size="lg" />
                  </div>
                ) : brandError ? (
                  <div className="mt-6 rounded-xl border border-dashed border-brand-border px-4 py-16 text-center">
                    <p className="text-body text-red-600">
                      {brandErrorDetail?.message ?? "브랜드를 불러올 수 없습니다."}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        router.push("/brands");
                        onClose();
                      }}
                      className="mt-4 rounded-full border border-brand-border px-4 py-2 text-caption font-medium text-brand-black transition-colors hover:bg-brand-bg"
                    >
                      브랜드 페이지로 이동
                    </button>
                  </div>
                ) : filteredBrands.length === 0 ? (
                  <div className="mt-6 rounded-xl border border-dashed border-brand-border px-4 py-16 text-center">
                    <p className="text-body text-brand-gray">
                      검색 결과에 맞는 브랜드가 없습니다.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {filteredBrands.map((brand) => (
                      <button
                        key={brand.id}
                        type="button"
                        onClick={() => {
                          router.push(`/brands/${brand.id}`);
                          onClose();
                        }}
                        className="rounded-lg border border-brand-border bg-brand-white px-3 py-3 text-left text-body font-medium text-brand-black transition-colors hover:bg-brand-bg"
                      >
                        <span className="line-clamp-2">{brand.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
