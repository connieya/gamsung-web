"use client";

import { useEffect, useMemo, useState } from "react";
import {
  brandGroups,
  menuCategories,
  popularBrands,
  type BrandGroup,
  type MenuTab,
} from "@/features/brand/mockMenuData";

interface GlobalMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalMenuModal({ isOpen, onClose }: GlobalMenuModalProps) {
  const [selectedTab, setSelectedTab] = useState<MenuTab>("category");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    menuCategories[0]?.id ?? ""
  );
  const [selectedBrandGroup, setSelectedBrandGroup] = useState<BrandGroup>("의류");
  const [searchTerm, setSearchTerm] = useState("");

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
    return popularBrands.filter((brand) => {
      if (brand.group !== selectedBrandGroup) return false;
      if (!normalizedSearch) return true;
      return brand.name.toLowerCase().includes(normalizedSearch);
    });
  }, [searchTerm, selectedBrandGroup]);

  const selectedCategory = useMemo(
    () => menuCategories.find((category) => category.id === selectedCategoryId),
    [selectedCategoryId]
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
            <>
              <aside className="w-52 shrink-0 border-r border-brand-border bg-[#fafafa] px-2 py-3">
                {menuCategories.map((category) => (
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
                  무신사 스타일로 자주 찾는 카테고리를 빠르게 탐색할 수 있어요.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {menuCategories.map((category) => (
                    <button
                      key={`tile-${category.id}`}
                      type="button"
                      className="rounded-lg border border-brand-border bg-brand-white px-4 py-4 text-left text-body font-medium text-brand-black transition-colors hover:bg-brand-bg"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <>
              <aside className="w-52 shrink-0 border-r border-brand-border bg-[#fafafa] px-2 py-3">
                {brandGroups.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setSelectedBrandGroup(group)}
                    className={`flex w-full items-center rounded-lg px-4 py-3 text-left text-body transition-colors ${
                      selectedBrandGroup === group
                        ? "bg-brand-black text-brand-white"
                        : "text-brand-black hover:bg-brand-bg"
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </aside>
              <section className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h3 className="text-display font-bold text-brand-black">
                      인기 브랜드 200
                    </h3>
                    <p className="mt-1 text-body text-brand-gray">
                      {selectedBrandGroup} 카테고리에서 브랜드를 골라보세요.
                    </p>
                  </div>
                  <p className="text-caption text-brand-gray">
                    결과 {filteredBrands.length}개
                  </p>
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
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {filteredBrands.map((brand) => (
                    <button
                      key={brand.id}
                      type="button"
                      className="rounded-lg border border-brand-border bg-brand-white px-3 py-3 text-left text-body font-medium text-brand-black transition-colors hover:bg-brand-bg"
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
