"use client";

import Link from "next/link";
import { useCart, useUpdateCartItemQuantity, useRemoveCartItem, useClearCart } from "@/features/cart/hooks";
import { useAuthStore } from "@/features/auth/store";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/features/cart/store";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export default function CartPage() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.userId);
  
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
    if (items.length === 0) {
      alert("장바구니가 비어있습니다.");
      return;
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
          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 p-4 rounded-xl border border-brand-border bg-brand-white"
              >
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
              <span className="text-title font-semibold text-brand-black">총 금액</span>
              <span className="text-display font-bold text-brand-black">
                {cart?.totalAmount.toLocaleString()}원
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full"
              size="lg"
            >
              주문하기
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
