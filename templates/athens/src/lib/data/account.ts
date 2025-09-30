import { HttpTypes } from "@etailify/types";
import useSWR from "swr";
import { sdk } from "../sdk-config";

const orderQueryKeys = {
  searchOrders: "searchOrders",
};

export const searchOrdersMutationFn = async (
  _: string,
  { arg }: { arg: { payload: HttpTypes.SearchApiParams } }
) => {
  return await sdk.customer.account.searchOrders(arg.payload);
};

export const useSearchOrders = (params: HttpTypes.SearchApiParams) => {
  const {
    data: orders,
    isLoading: isSearchingOrders,
    error,
    isValidating,
  } = useSWR(orderQueryKeys.searchOrders, () =>
    searchOrdersMutationFn(orderQueryKeys.searchOrders, {
      arg: { payload: params },
    })
  );

  return {
    orders,
    isSearchingOrders,
    isError: !!error,
    error,
    isValidating,
  };
};
