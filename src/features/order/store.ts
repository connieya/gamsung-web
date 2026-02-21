import { create } from "zustand";

interface OrderFlowState {
  buyNowCartItemId: number | null;
  setBuyNowCartItemId: (cartItemId: number) => void;
  consumeBuyNowCartItemId: () => number | null;
  clearBuyNowCartItemId: () => void;
}

export const useOrderFlowStore = create<OrderFlowState>((set, get) => ({
  buyNowCartItemId: null,
  setBuyNowCartItemId: (cartItemId) => set({ buyNowCartItemId: cartItemId }),
  consumeBuyNowCartItemId: () => {
    const cartItemId = get().buyNowCartItemId;
    set({ buyNowCartItemId: null });
    return cartItemId;
  },
  clearBuyNowCartItemId: () => set({ buyNowCartItemId: null }),
}));
