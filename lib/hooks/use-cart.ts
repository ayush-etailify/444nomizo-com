import { useCartStore2 } from "../stores/use-cart-store2";
import { Product } from "../types/products";
import { isCustomerLoggedIn } from "../utils/common";

export const useCart = () => {
  const { addItem, currentOrder, hasActiveCart } = useCartStore2();

  const addToCart = (product: Product) => {
    console.log(hasActiveCart(), "hasActiveCart");

    if (isCustomerLoggedIn()) {
      // has active currentOrder?
      // N: 1. create new order  > 2. useCart [addTocart > useCartStore(state+LC)]
      // Y: 1. upsertCart > N:2
      // are the responses of createNewOrder<T>, upsertCart<T>, currentOrder<{order: T}> same?
    } else {
      // For non-logged-in users, simply update the cart store
      alert("simply update the cartStore");
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

  return {
    addToCart,
    // currentOrder,
    // cartItems: currentOrder.products,
    // cartItemCount: currentOrder.products.length,
  };
};
