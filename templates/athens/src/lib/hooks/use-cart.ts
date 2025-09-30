"use client";

import { Product } from "@etailify/types";
import { useCreateOrder, useUpsertCart } from "../data/order";
import { isCustomerLoggedIn } from "../utils/common";
import { useCartStore } from "./use-cart-store";

export const useCart = () => {
  const { createOrder, isCreatingOrder } = useCreateOrder();
  const { upsertCart, isUpsertingCart } = useUpsertCart();
  const {
    currentOrder,
    addItem,
    removeItem,
    clearCart,
    getTotal,
    hasActiveCart,
    setCurrentOrder,
  } = useCartStore();

  const addToCart = async (product: Product) => {
    if (isCustomerLoggedIn()) {
      const productsAddedPayload = [
        {
          product_id: product.uuid as string,
          product_type: product.product_type,
          sku_id: product.skus[0].uuid as string,
          quantity: "1",
        },
      ];

      if (hasActiveCart()) {
        const upsertCartPayload = {
          products_added: productsAddedPayload,
        };

        const upsertCartResponse = await upsertCart({
          orderId: currentOrder.uuid as string,
          payload: upsertCartPayload,
        });

        setCurrentOrder(upsertCartResponse);
      } else {
        const orderResponse = await createOrder({
          payload: productsAddedPayload,
        });

        setCurrentOrder(orderResponse);
      }
    } else {
      addItem({
        product_id: product.uuid as string,
        product_type: product.product_type,
        quantity: "1",
        sku_id: product.skus[0].uuid as string,
        product: product,
        cost_price: product.skus[0].cost_price ?? "",
        max_retail_price: product.skus[0].max_retail_price ?? "",
        selling_price: product.skus[0].selling_price ?? "",
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (isCustomerLoggedIn()) {
      if (hasActiveCart()) {
        const upsertCartResponse = await upsertCart({
          orderId: currentOrder.uuid as string,
          payload: {
            products_deleted: [productId],
          },
        });

        setCurrentOrder(upsertCartResponse);
      } else {
        alert("Invalid cart. Try reloading the page.");
      }
    } else {
      removeItem(productId);
    }
  };

  return {
    addToCart,
    removeFromCart,
    removeItem,
    clearCart,
    getTotal,
    hasActiveCart,
    setCurrentOrder,
    currentOrder,
    cartItems: currentOrder.products,
    asyncState: {
      isCreatingOrder,
      isUpsertingCart,
    },
  };
};
