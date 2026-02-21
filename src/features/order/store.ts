import { create } from "zustand";

interface OrderFlowState {
  selectedCartItemIds: number[];
  setSelectedCartItemIds: (ids: number[]) => void;
  clearSelectedCartItemIds: () => void;
}

export const useOrderFlowStore = create<OrderFlowState>((set) => ({
  selectedCartItemIds: [],
  setSelectedCartItemIds: (ids) => set({ selectedCartItemIds: ids }),
  clearSelectedCartItemIds: () => set({ selectedCartItemIds: [] }),
}));
