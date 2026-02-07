"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRegister } from "@/features/auth/hooks";

export default function JoinPage() {
  const router = useRouter();
  const register = useRegister();
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("MALE");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !email.trim() || !birthDate.trim()) return;
    register.mutate(
      { userId: userId.trim(), email: email.trim(), birthDate, gender },
      {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      }
    );
  };

  return (
    <div className="w-full rounded-2xl border border-brand-border bg-brand-white p-8 shadow-card sm:p-10">
      <h1 className="text-display font-bold text-brand-black">회원가입</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input
          label="사용자 ID"
          placeholder="예: user1"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <Input
          label="이메일"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="생년월일"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />
        <div>
          <label className="mb-1.5 block text-body font-medium text-brand-black">
            성별
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full rounded-lg border border-brand-border bg-brand-white px-4 py-3 text-body text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-black"
          >
            <option value="MALE">남성</option>
            <option value="FEMALE">여성</option>
          </select>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={
            register.isPending ||
            !userId.trim() ||
            !email.trim() ||
            !birthDate.trim()
          }
          isLoading={register.isPending}
        >
          가입하기
        </Button>
      </form>
      {register.isError && (
        <p className="mt-2 text-caption text-red-600">
          {register.error?.message}
        </p>
      )}
      <Link
        href="/login"
        className="mt-6 block text-center text-body text-brand-gray hover:text-brand-black"
      >
        로그인
      </Link>
    </div>
  );
}
