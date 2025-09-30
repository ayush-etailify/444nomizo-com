"use client";

import { useEffect } from "react";
import { SWRConfiguration } from "swr";
import { useGetCurrentOrder } from "../data/order";
import { isCustomerLoggedIn } from "../utils/common";
import { useCartStore } from "./use-cart-store";

export const useServerCart = (
  enabled: boolean = true,
  options?: SWRConfiguration
) => {
  const { serverCurrentOrder, isLoading, isError, error, isValidating } =
    useGetCurrentOrder(isCustomerLoggedIn() && enabled, options);
  const { setCurrentOrder } = useCartStore();

  useEffect(() => {
    if (serverCurrentOrder?.order && !isLoading && !isValidating) {
      setCurrentOrder(serverCurrentOrder.order);
    }
  }, [serverCurrentOrder, isLoading, setCurrentOrder]);

  return {
    serverCurrentOrder,
    customer: serverCurrentOrder?.order?.customer?.customer,
    isLoading,
    isError,
    error,
    isValidating,
  };
};
