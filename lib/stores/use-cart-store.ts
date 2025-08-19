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

export type CurrentOrder = {
  uuid: string;
  order_status: string;
  products: any[];
  cancelled_products: any[];
  bill: {
    product_total: string;
    tax_total: string;
    discount_total: string;
    charge_total: string;
    gross_total: string;
    net_total: string;
  };
  customer: {
    uuid: string;
    order_id: string;
    customer_id: string;
    customer: any;
    addresses: [];
  };
};

type CartStore = {
  items: CartItem[]; // not
  currentOrder: CurrentOrder | null | undefined; // logged
  setCurrentOrder: (currentOrder: CurrentOrder) => void;
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
      currentOrder: null,
      setCurrentOrder: (currentOrder: CurrentOrder) => set({ currentOrder }),
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
      clearCart: () => set({ items: [], currentOrder: null }),
      getTotal: () =>
        get().items.reduce((acc, item) => {
          return acc + Number(item.meta.selling_price) * Number(item.quantity);
        }, 0),
    }),
    {
      name: "cartStore",
      partialize: (state) => ({
        items: state.items,
        currentOrder: state.currentOrder,
      }),
    }
  )
);
