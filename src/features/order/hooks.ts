"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import {
  getOrderDetail,
  getOrders,
  getOrderForm,
  issueOrderNo,
  readyOrder,
  createPaymentSession,
} from "./api";
import type { OrderFormResponse } from "./types";
import { useOrderFlowStore } from "./store";
import {
  resolvePayment,
  type MainPaymentOption,
  type SubPaymentOption,
} from "@/features/payment/constants";

// ── Query Keys ──

const ordersKey = ["order", "list"] as const;
const orderDetailKey = ["order", "detail"] as const;

// ── 기존 훅 ──

export function useOrders() {
  const userId = useAuthStore((s) => s.userId);
  return useQuery({
    queryKey: [...ordersKey, userId ?? ""],
    queryFn: () => getOrders(userId!),
    enabled: !!userId,
  });
}

export function useOrderDetail(orderId: number | null) {
  const userId = useAuthStore((s) => s.userId);
  return useQuery({
    queryKey: [...orderDetailKey, orderId, userId ?? ""],
    queryFn: () => getOrderDetail(userId!, orderId!),
    enabled: !!userId && orderId != null,
  });
}

// ── 주문서 페이지 전용 훅 ──

export function useOrderCheckout() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.userId);
  const isLoggedIn = !!userId;

  // 주문서 데이터
  const [orderFormData, setOrderFormData] = useState<OrderFormResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 배송지
  const [recipientName, setRecipientName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  // 결제 수단
  const [selectedPayment, setSelectedPayment] = useState<MainPaymentOption>("MUSINSA_PAY");
  const [selectedSubPayment, setSelectedSubPayment] = useState<SubPaymentOption>("CARD");

  // 결제 진행 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [orderNo, setOrderNo] = useState<string | null>(null);
  const [orderKey, setOrderKey] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const fetchedRef = useRef(false);

  // 주문서 데이터 로드
  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    if (!userId || fetchedRef.current) return;
    fetchedRef.current = true;

    const { selectedCartItemIds } = useOrderFlowStore.getState();
    useOrderFlowStore.getState().clearSelectedCartItemIds();

    getOrderForm(userId, selectedCartItemIds, Date.now())
      .then((data) => {
        setOrderFormData(data);
        if (data.member.userId) {
          setRecipientName(data.member.userId);
        }
      })
      .catch((error) => {
        console.error("주문서 로드 실패:", error);
        alert("주문서를 불러오는데 실패했습니다.");
      })
      .finally(() => setIsLoading(false));
  }, [isLoggedIn, userId, router]);

  // 결제 제출
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!recipientName || !address || !phone) {
        alert("배송지 정보를 모두 입력해주세요.");
        return;
      }
      if (!orderFormData || !userId) return;

      setIsSubmitting(true);

      try {
        const issueResult = await issueOrderNo(userId, { isNewOrderForm: true });
        setOrderNo(issueResult.orderNo);
        setOrderKey(issueResult.orderKey);

        const orderItems = orderFormData.cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }));

        const { paymentMethod, payKind } = resolvePayment(selectedPayment, selectedSubPayment);

        await readyOrder(userId, issueResult.orderNo, {
          paymentMethod,
          payKind,
          orderKey: issueResult.orderKey,
          orderItems,
          couponId: null,
        });

        const sessionResult = await createPaymentSession(userId, {
          orderNo: issueResult.orderNo,
          orderKey: issueResult.orderKey,
          paymentMethod,
          payKind,
          orderItems,
          ...(payKind === "CARD" && {
            cardType: "SAMSUNG" as const,
            cardNumber: "1234-5678-9012-3456",
          }),
          couponId: null,
        });

        setPaymentUrl(sessionResult.paymentUrl);
        setIsPaymentModalOpen(true);
      } catch (error) {
        console.error("결제 준비 실패:", error);
        alert("결제 준비 중 오류가 발생했습니다.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [recipientName, address, phone, orderFormData, userId, selectedPayment, selectedSubPayment],
  );

  // 결제 성공 콜백
  const handlePaymentSuccess = useCallback(() => {
    setIsPaymentModalOpen(false);
    if (orderNo) {
      router.push(`/order/order_result/${orderNo}`);
    }
  }, [orderNo, router]);

  // 현재 선택된 payKind
  const resolvedPayKind = resolvePayment(selectedPayment, selectedSubPayment).payKind;

  return {
    // 상태
    isLoading,
    isSubmitting,
    orderFormData,

    // 배송지
    recipientName,
    setRecipientName,
    address,
    setAddress,
    phone,
    setPhone,

    // 결제 수단
    selectedPayment,
    setSelectedPayment,
    selectedSubPayment,
    setSelectedSubPayment,
    resolvedPayKind,

    // 결제 모달
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    orderNo,
    orderKey,
    paymentUrl,

    // 액션
    handleSubmit,
    handlePaymentSuccess,
  };
}
