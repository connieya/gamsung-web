import type { PaymentMethod, PayKind } from "./types";

// ── 결제 수단 선택 옵션 타입 ──

export type MainPaymentOption =
  | "MUSINSA_MONEY"
  | "MUSINSA_PAY"
  | "TOSSPAY"
  | "KAKAOPAY"
  | "PAYCO"
  | "OTHER";

export type SubPaymentOption =
  | "CARD"
  | "MOBILE"
  | "VIRTUAL_ACCOUNT"
  | "SAMSUNG_PAY";

// ── 결제 수단 선택지 상수 ──

export const MAIN_PAYMENT_OPTIONS: { value: MainPaymentOption; label: string }[] = [
  { value: "MUSINSA_MONEY", label: "무신사머니" },
  { value: "MUSINSA_PAY", label: "무신사페이" },
  { value: "TOSSPAY", label: "토스페이" },
  { value: "KAKAOPAY", label: "카카오페이" },
  { value: "PAYCO", label: "페이코" },
  { value: "OTHER", label: "기타 결제" },
];

export const SUB_PAYMENT_OPTIONS: { value: SubPaymentOption; label: string }[] = [
  { value: "CARD", label: "카드" },
  { value: "MOBILE", label: "휴대폰" },
  { value: "VIRTUAL_ACCOUNT", label: "가상계좌" },
  { value: "SAMSUNG_PAY", label: "삼성페이" },
];

// ── 선택 → API 파라미터 변환 ──

export function resolvePayment(
  main: MainPaymentOption,
  sub: SubPaymentOption,
): { paymentMethod: PaymentMethod; payKind: PayKind } {
  switch (main) {
    case "MUSINSA_MONEY":
      return { paymentMethod: "POINT", payKind: "POINT" };
    case "MUSINSA_PAY":
      return { paymentMethod: "SIMPLE_PAY", payKind: "MUSINSA_PAY" };
    case "TOSSPAY":
      return { paymentMethod: "SIMPLE_PAY", payKind: "TOSSPAY" };
    case "KAKAOPAY":
      return { paymentMethod: "SIMPLE_PAY", payKind: "KAKAOPAY" };
    case "PAYCO":
      return { paymentMethod: "SIMPLE_PAY", payKind: "PAYCO" };
    case "OTHER":
      switch (sub) {
        case "CARD":
          return { paymentMethod: "CARD", payKind: "CARD" };
        case "MOBILE":
          return { paymentMethod: "CARD", payKind: "MOBILE" };
        case "VIRTUAL_ACCOUNT":
          return { paymentMethod: "ACCOUNT", payKind: "VIRTUAL_ACCOUNT" };
        case "SAMSUNG_PAY":
          return { paymentMethod: "SIMPLE_PAY", payKind: "SAMSUNG_PAY" };
      }
  }
}
