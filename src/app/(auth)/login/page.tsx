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
    <div className="w-full rounded-2xl border border-brand-border bg-brand-white p-8 shadow-card sm:p-10">
      <h1 className="text-display font-bold text-brand-black">로그인</h1>
      <p className="mt-2 text-body text-brand-gray">
        데모: 사용자 ID를 입력하면 로그인됩니다. (X-USER-ID)
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
        className="mt-6 block text-center text-body text-brand-gray hover:text-brand-black"
      >
        회원가입
      </Link>
    </div>
  );
}
