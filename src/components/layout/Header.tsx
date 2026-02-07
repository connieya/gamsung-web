"use client";

import Link from "next/link";
import { useAuthStore } from "@/features/auth/store";

export function Header() {
  const userId = useAuthStore((s) => s.userId);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-brand-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-xl font-bold tracking-tight text-brand-black hover:opacity-80"
        >
          GAMSUNG
        </Link>

        <div className="hidden flex-1 max-w-md sm:block">
          <div className="rounded-full border border-brand-border bg-brand-bg px-4 py-2.5 text-caption text-brand-gray">
            상품 검색
          </div>
        </div>

        <nav className="flex shrink-0 items-center gap-6">
          <Link href="/products" className="link-nav font-medium">
            스타일
          </Link>
          <Link href="/ranking" className="link-nav font-medium">
            랭킹
          </Link>
          {userId ? (
            <>
              <Link href="/my-page" className="link-nav font-medium">
                마이
              </Link>
              <button
                type="button"
                onClick={logout}
                className="link-nav text-caption"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="link-nav font-medium">
                로그인
              </Link>
              <Link
                href="/join"
                className="rounded-full bg-brand-black px-4 py-2 text-caption font-medium text-white hover:bg-black"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
