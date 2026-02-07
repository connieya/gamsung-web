"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/features/auth/store";

export default function LoginPage() {
  const router = useRouter();
  const setUserId = useAuthStore((s) => s.setUserId);
  const [userId, setUserIdInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = userId.trim();
    if (!trimmed) return;
    setUserId(trimmed);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-bold text-gray-900">로그인</h1>
      <p className="mt-1 text-sm text-gray-500">
        데모: 사용자 ID를 입력하면 로그인됩니다. (X-USER-ID)
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          label="사용자 ID"
          placeholder="예: user1"
          value={userId}
          onChange={(e) => setUserIdInput(e.target.value)}
          autoComplete="username"
        />
        <Button type="submit" className="w-full" disabled={!userId.trim()}>
          로그인
        </Button>
      </form>
      <Link
        href="/join"
        className="mt-4 block text-center text-sm text-gray-600 hover:underline"
      >
        회원가입
      </Link>
    </div>
  );
}
