import { ProductType } from "@/lib/types/products";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  product_id: string;
  product_type: ProductType;
  quantity: string;
  sku_id: string;
  meta: {
    product_name: string;
    selling_price: string;
    max_retail_price: string;
    media_public_url?: string;
  };
};

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (product_id: string, skuId: string) => void;
  updateQuantity: (productId: string, skuId: string, quantity: string) => void;
  clearCart: () => void;
  getTotal: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.product_id === item.product_id && i.sku_id === item.sku_id
          );

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.product_id === item.product_id && i.sku_id === item.sku_id
                  ? {
                      ...i,
                      quantity: String(
                        Number(i.quantity) + Number(item.quantity)
                      ),
                    }
                  : i
              ),
            };
          }

          return { items: [...state.items, item] };
        }),
      removeItem: (product_id, sku_id) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.product_id === product_id && item.sku_id === sku_id)
          ),
        })),
      updateQuantity: (product_id, sku_id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product_id === product_id && item.sku_id === sku_id
              ? { ...item, quantity }
              : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotal: () =>
        get().items.reduce((acc, item) => {
          return acc + Number(item.meta.selling_price) * Number(item.quantity);
        }, 0),
    }),
    {
      name: "cart-store",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
