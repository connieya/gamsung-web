"use client";

import { useCart, useUpdateCartItemQuantity, useRemoveCartItem, useClearCart } from "@/features/cart/hooks";
import { useAuth } from "@/features/auth/store";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/features/cart/store";

export default function CartPage() {
  const router = useRouter();
  const { userId } = useAuth();
  
  // 로그인 상태면 서버 장바구니 사용, 아니면 로컬 스토어 사용
  const { data: serverCart, isLoading } = useCart();
  const localCart = useCartStore((state) => ({
    items: state.items,
    getTotalAmount: state.getTotalAmount,
    updateQuantity: state.updateQuantity,
    removeItem: state.removeItem,
    clearItems: state.clearItems,
  }));

  const updateQuantityMutation = useUpdateCartItemQuantity();
  const removeItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  const isLoggedIn = !!userId;
  const cart = isLoggedIn ? serverCart : { items: localCart.items, totalAmount: localCart.getTotalAmount() };
  const items = cart?.items ?? [];

  const handleQuantityChange = (itemId: number | undefined, productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    if (isLoggedIn && itemId) {
      updateQuantityMutation.mutate({ itemId, quantity: newQuantity });
    } else {
      localCart.updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: number | undefined, productId: number) => {
    if (isLoggedIn && itemId) {
      removeItemMutation.mutate(itemId);
    } else {
      localCart.removeItem(productId);
    }
  };

  const handleClearCart = () => {
    if (isLoggedIn) {
      clearCartMutation.mutate();
    } else {
      localCart.clearItems();
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      alert("장바구니가 비어있습니다.");
      return;
    }
    router.push("/order/new");
  };

  if (isLoading && isLoggedIn) {
    return <div className="container mx-auto p-6">로딩 중...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">장바구니</h1>
        {items.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-sm text-red-600 hover:underline"
          >
            전체 삭제
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          장바구니가 비어있습니다.
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{item.productName}</h3>
                  <p className="text-sm text-gray-600">
                    {item.price.toLocaleString()}원
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.itemId, item.productId, item.quantity - 1)
                    }
                    className="w-8 h-8 border rounded hover:bg-gray-100"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.itemId, item.productId, item.quantity + 1)
                    }
                    className="w-8 h-8 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="font-medium">
                    {(item.price * item.quantity).toLocaleString()}원
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.itemId, item.productId)}
                  className="text-gray-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">총 금액</span>
              <span className="text-2xl font-bold text-blue-600">
                {cart?.totalAmount.toLocaleString()}원
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              주문하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
