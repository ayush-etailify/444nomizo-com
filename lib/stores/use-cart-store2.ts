import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, ProductType } from "../types/products";

export type Customer = {
  uuid: string;
  order_id: string;
  customer_id: string;
  customer: any;
  addresses: [];
};

export type CustomerOrderBill = {
  product_total: string;
  tax_total: string;
  discount_total: string;
  charge_total: string;
  gross_total: string;
  net_total: string;
};

export type CustomerOrderProduct = {
  product_id: string;
  product_type: ProductType;
  quantity: string;
  sku_id: string; // sku uuid
  instructions?: string;
  product: Product;
  cost_price: string;
  max_retail_price: string;
  selling_price: string;
  // need explaintation for the following
  //   tax: string;
  //   discount: string;
  //   gross_price: string;
  //   net_price: string;
};

export type CustomerCurrentOrder = {
  products: CustomerOrderProduct[];
  uuid?: string;
  order_status?: string;
  bill?: CustomerOrderBill;
  customer?: Customer;
};

export type CartStore = {
  currentOrder: CustomerCurrentOrder;
  addItem: (item: CustomerOrderProduct) => void;
  //   removeItem: (item: CustomerOrderProduct) => void;
  //   clearCart: () => void;
  hasActiveCart: () => boolean;
};

export const useCartStore2 = create<CartStore>()(
  persist(
    (set, get) => ({
      currentOrder: {
        products: [],
      },
      addItem: (item) => {
        set((state) => ({
          currentOrder: {
            ...state.currentOrder,
            products: [...state.currentOrder.products, item],
          },
        }));
      },
      hasActiveCart: () => {
        return Boolean(get().currentOrder.uuid);
      },
    }),
    {
      name: "cartStore2",
      partialize: (state) => ({
        currentOrder: state.currentOrder,
      }),
    }
  )
);
