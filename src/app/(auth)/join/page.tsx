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
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-bold text-gray-900">회원가입</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
          <label className="mb-1 block text-sm font-medium text-gray-700">
            성별
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
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
        <p className="mt-2 text-sm text-red-600">{register.error?.message}</p>
      )}
      <Link
        href="/login"
        className="mt-4 block text-center text-sm text-gray-600 hover:underline"
      >
        로그인
      </Link>
    </div>
  );
}
