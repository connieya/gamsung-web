"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart, useUpdateCartItemQuantity, useRemoveCartItem, useClearCart } from "@/features/cart/hooks";
import { useAuthStore } from "@/features/auth/store";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/features/cart/store";
import { useOrderFlowStore } from "@/features/order/store";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export default function CartPage() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.userId);
  const setSelectedCartItemIds = useOrderFlowStore((s) => s.setSelectedCartItemIds);

  // 로그인 상태면 서버 장바구니 사용, 아니면 로컬 스토어 사용
  const { data: serverCart, isLoading } = useCart();
  const localCartItems = useCartStore((state) => state.items);
  const getLocalCartTotalAmount = useCartStore((state) => state.getTotalAmount);
  const updateLocalCartQuantity = useCartStore((state) => state.updateQuantity);
  const removeLocalCartItem = useCartStore((state) => state.removeItem);
  const clearLocalCartItems = useCartStore((state) => state.clearItems);

  const updateQuantityMutation = useUpdateCartItemQuantity();
  const removeItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  const isLoggedIn = !!userId;
  const cart = isLoggedIn
    ? serverCart
    : { items: localCartItems, totalAmount: getLocalCartTotalAmount() };
  const items = cart?.items ?? [];

  // 선택 상태 관리 (로그인 사용자만)
  const [selectedIds, setSelectedIds] = useState<Set<number> | null>(null);

  // 최초 진입 시 전체 선택, 이후 아이템 삭제 시 존재하지 않는 ID만 제거
  useEffect(() => {
    if (!isLoggedIn || items.length === 0) return;

    setSelectedIds((prev) => {
      if (prev === null) {
        // 최초 진입: 전체 선택
        return new Set(items.map((item) => item.itemId!).filter(Boolean));
      }
      // 이후: 현재 존재하는 아이템 ID와 교집합 (삭제된 아이템 ID 제거)
      const currentIds = new Set(items.map((item) => item.itemId!).filter(Boolean));
      return new Set([...prev].filter((id) => currentIds.has(id)));
    });
  }, [isLoggedIn, items]);

  const selected = selectedIds ?? new Set<number>();
  const isAllSelected = isLoggedIn && items.length > 0 && selected.size === items.filter((i) => i.itemId).length;

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((item) => item.itemId!).filter(Boolean)));
    }
  };

  const handleToggleItem = (itemId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const selectedTotal = isLoggedIn
    ? items
        .filter((item) => item.itemId && selected.has(item.itemId))
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
    : cart?.totalAmount ?? 0;

  const handleQuantityChange = (itemId: number | undefined, productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    if (isLoggedIn && itemId) {
      updateQuantityMutation.mutate({ itemId, quantity: newQuantity });
    } else {
      updateLocalCartQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: number | undefined, productId: number) => {
    if (isLoggedIn && itemId) {
      removeItemMutation.mutate(itemId);
    } else {
      removeLocalCartItem(productId);
    }
  };

  const handleClearCart = () => {
    if (isLoggedIn) {
      clearCartMutation.mutate();
    } else {
      clearLocalCartItems();
    }
  };

  const handleCheckout = () => {
    if (isLoggedIn) {
      const ids = Array.from(selected);
      if (ids.length === 0) {
        alert("주문할 상품을 선택해주세요.");
        return;
      }
      setSelectedCartItemIds(ids);
    } else {
      if (items.length === 0) {
        alert("장바구니가 비어있습니다.");
        return;
      }
    }
    router.push("/order/order-form");
  };

  if (isLoading && isLoggedIn) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-display font-bold text-brand-black">장바구니</h1>
        {items.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-body text-red-600 hover:underline transition-colors"
          >
            전체 삭제
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-body text-brand-gray mb-6">장바구니가 비어있습니다.</p>
          <Link href="/products">
            <Button>쇼핑 계속하기</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* 전체 선택 (로그인 사용자만) */}
          {isLoggedIn && (
            <label className="flex items-center gap-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleToggleAll}
                className="w-5 h-5 accent-brand-black rounded"
              />
              <span className="text-body font-medium text-brand-black">
                전체 선택 ({selected.size}/{items.length})
              </span>
            </label>
          )}

          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 p-4 rounded-xl border border-brand-border bg-brand-white"
              >
                {/* 개별 체크박스 (로그인 사용자만) */}
                {isLoggedIn && item.itemId && (
                  <input
                    type="checkbox"
                    checked={selected.has(item.itemId)}
                    onChange={() => handleToggleItem(item.itemId!)}
                    className="w-5 h-5 accent-brand-black rounded flex-shrink-0"
                  />
                )}

                <div className="flex-1">
                  <h3 className="text-body font-medium text-brand-black">{item.productName}</h3>
                  <p className="text-caption text-brand-gray mt-1">
                    {item.price.toLocaleString()}원
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.itemId, item.productId, item.quantity - 1)
                    }
                    className="w-8 h-8 border border-brand-border rounded-lg hover:bg-brand-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-body font-medium text-brand-black">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.itemId, item.productId, item.quantity + 1)
                    }
                    className="w-8 h-8 border border-brand-border rounded-lg hover:bg-brand-bg transition-colors"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[120px]">
                  <p className="text-title font-semibold text-brand-black">
                    {(item.price * item.quantity).toLocaleString()}원
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.itemId, item.productId)}
                  className="text-brand-gray hover:text-red-600 transition-colors p-2"
                  aria-label="삭제"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-brand-border bg-brand-bg p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-title font-semibold text-brand-black">
                {isLoggedIn ? `선택 상품 금액 (${selected.size}건)` : "총 금액"}
              </span>
              <span className="text-display font-bold text-brand-black">
                {selectedTotal.toLocaleString()}원
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full"
              size="lg"
              disabled={isLoggedIn && selected.size === 0}
            >
              주문하기
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
