"use client";

import Link from "next/link";
import { useAuthStore } from "@/features/auth/store";

export function Header() {
  const userId = useAuthStore((s) => s.userId);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-bold text-gray-900 hover:text-gray-700"
        >
          Gamsung
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/products"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            상품
          </Link>
          {userId ? (
            <>
              <Link
                href="/my-page"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                마이페이지
              </Link>
              <button
                type="button"
                onClick={logout}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                로그인
              </Link>
              <Link
                href="/join"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
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
