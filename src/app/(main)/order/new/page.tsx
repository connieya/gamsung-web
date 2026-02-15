"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/hooks";
import { useCartStore } from "@/features/cart/store";
import { useAuth } from "@/features/auth/store";
import { placeOrder } from "@/features/order/api";
import { Button } from "@/components/ui/Button";

export default function OrderNewPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const isLoggedIn = !!userId;

  // 서버 장바구니 또는 로컬 장바구니
  const { data: serverCart } = useCart();
  const localCart = useCartStore((state) => ({
    items: state.items,
    getTotalAmount: state.getTotalAmount,
  }));

  const cart = isLoggedIn ? serverCart : { items: localCart.items, totalAmount: localCart.getTotalAmount() };
  const items = cart?.items ?? [];

  // 배송지 정보
  const [recipientName, setRecipientName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientName || !address || !phone) {
      alert("배송지 정보를 모두 입력해주세요.");
      return;
    }

    if (items.length === 0) {
      alert("주문할 상품이 없습니다.");
      return;
    }

    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    // 주문 생성 API 호출
    try {
      const result = await placeOrder(userId, {
        couponId: null,
        orderItems: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
      const orderId = result.orderId;

      // 결제 페이지로 이동 (주문 ID와 배송지 정보 전달)
      router.push(
        `/order/payment?orderId=${orderId}&recipientName=${encodeURIComponent(recipientName)}&address=${encodeURIComponent(address)}&phone=${encodeURIComponent(phone)}`
      );
    } catch (error) {
      console.error(error);
      alert("주문 생성 중 오류가 발생했습니다.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">주문서 작성</h1>
        <div className="text-center py-12 text-gray-500">
          주문할 상품이 없습니다.
        </div>
        <Button onClick={() => router.push("/products")} className="w-full">
          쇼핑 계속하기
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">주문서 작성</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 주문 상품 목록 */}
        <section className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">주문 상품</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-gray-600">
                    {item.price.toLocaleString()}원 × {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {(item.price * item.quantity).toLocaleString()}원
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 배송지 정보 */}
        <section className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">배송지 정보</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                받는 사람 이름
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="홍길동"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">주소</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="서울시 강남구 테헤란로 123"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                전화번호
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="010-1234-5678"
                required
              />
            </div>
          </div>
        </section>

        {/* 결제 금액 */}
        <section className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">총 결제 금액</span>
            <span className="text-2xl font-bold text-blue-600">
              {cart?.totalAmount.toLocaleString()}원
            </span>
          </div>
        </section>

        <Button type="submit" className="w-full" size="lg">
          결제하기
        </Button>
      </form>
    </div>
  );
}
