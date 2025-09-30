"use client";

import { CustomerCurrentOrder, CustomerOrderProduct } from "@etailify/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStore {
  currentOrder: CustomerCurrentOrder;
  setCurrentOrder: (order: CustomerCurrentOrder) => void;
  addItem: (item: CustomerOrderProduct) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  hasActiveCart: () => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      currentOrder: {
        products: [],
      },
      setCurrentOrder: (order) => {
        set({ currentOrder: order });
      },
      addItem: (item) => {
        set((state) => ({
          currentOrder: {
            ...state.currentOrder,
            products: [...state.currentOrder.products, item],
          },
        }));
      },
      removeItem: (itemId) => {
        set((state) => ({
          currentOrder: {
            ...state.currentOrder,
            products: state.currentOrder.products.filter(
              (p) => p.product_id !== itemId
            ),
          },
        }));
      },
      clearCart: () => {
        set({ currentOrder: { products: [] } });
      },
      hasActiveCart: () => {
        return Boolean(get().currentOrder.uuid);
      },
      getTotal: () => {
        return get().currentOrder.products.reduce(
          (acc, item) => acc + parseFloat(item.selling_price),
          0
        );
      },
    }),
    {
      name: "cartStore",
      partialize: (state) => ({
        currentOrder: state.currentOrder,
      }),
    }
  )
);
