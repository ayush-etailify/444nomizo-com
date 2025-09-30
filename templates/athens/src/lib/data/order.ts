import {
  Customer,
  CustomerAddress,
  CustomerCurrentOrderUpsertPayload,
  CustomerOrderProductItem,
} from "@etailify/types";
import useSWR, { SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";
import { sdk } from "../sdk-config";

const orderQueryKeys = {
  createOrder: "createOrder",
  getCurrentOrder: "getCurrentOrder",
  upsertCart: "upsertCart",
  upsertDeliveryAddress: "upsertDeliveryAddress",
  upsertCustomerDetails: "upsertCustomerDetails",
  initializeOrderPayment: "initializeOrderPayment",
};

// create order

export const createOrderMutationFn = async (
  _: string,
  { arg }: { arg: { payload: CustomerOrderProductItem[] } }
) => {
  const response = await sdk.customer.order.createOrder(arg.payload);
  return response;
};

export const useCreateOrder = () => {
  const {
    data: createdOrder,
    trigger: createOrder,
    isMutating: isCreatingOrder,
    error,
  } = useSWRMutation(orderQueryKeys.createOrder, createOrderMutationFn);

  return {
    createdOrder,
    createOrder,
    isCreatingOrder,
    isError: !!error,
    error,
  };
};

// get current order

export const useGetCurrentOrder = (
  enabled: boolean,
  options?: SWRConfiguration
) => {
  const {
    data: serverCurrentOrder,
    isLoading,
    error,
    isValidating,
  } = useSWR(
    enabled && orderQueryKeys.getCurrentOrder,
    () => sdk.customer.order.getCurrentOrder(),
    options
  );

  return {
    serverCurrentOrder,
    isLoading,
    isError: !!error,
    error,
    isValidating,
  };
};

// upsert cart

export const upsertCartMutationFn = async (
  _: string,
  {
    arg,
  }: { arg: { orderId: string; payload: CustomerCurrentOrderUpsertPayload } }
) => {
  const response = await sdk.customer.order.upsertCart(
    arg.orderId,
    arg.payload
  );
  return response;
};

export const useUpsertCart = () => {
  const {
    trigger: upsertCart,
    isMutating: isUpsertingCart,
    error,
  } = useSWRMutation(orderQueryKeys.upsertCart, upsertCartMutationFn);

  return { upsertCart, isUpsertingCart, isError: !!error, error };
};

// upsert delivery address

export const upsertDeliveryAddressMutationFn = async (
  _: string,
  { arg }: { arg: { orderId: string; payload: CustomerAddress } }
) => {
  return await sdk.customer.order.upsertDeliveryAddress(
    arg.orderId,
    arg.payload
  );
};

export const useUpsertDeliveryAddress = () => {
  const {
    trigger: upsertDeliveryAddress,
    isMutating: isUpsertingDeliveryAddress,
    error,
  } = useSWRMutation(
    orderQueryKeys.upsertDeliveryAddress,
    upsertDeliveryAddressMutationFn
  );
  return {
    upsertDeliveryAddress,
    isUpsertingDeliveryAddress,
    isError: !!error,
    error,
  };
};

// upsert customer details

export const upsertCustomerDetailsMutationFn = async (
  _: string,
  { arg }: { arg: { orderId: string; payload: Customer } }
) => {
  return await sdk.customer.account.upsertCustomerDetails(
    arg.orderId,
    arg.payload
  );
};

export const useUpsertCustomerDetails = () => {
  const {
    trigger: upsertCustomerDetails,
    isMutating: isUpsertingCustomerDetails,
    error,
  } = useSWRMutation(
    orderQueryKeys.upsertCustomerDetails,
    upsertCustomerDetailsMutationFn
  );
  return {
    upsertCustomerDetails,
    isUpsertingCustomerDetails,
    isError: !!error,
    error,
  };
};

// initialize payment

export const initializeOrderPaymentMutationFn = async (
  _: string,
  { arg }: { arg: { orderId: string } }
) => {
  return await sdk.customer.order.initializePayment(arg.orderId);
};

export const useInitializeOrderPayment = () => {
  const {
    trigger: initializeOrderPayment,
    isMutating: isInitializingOrderPayment,
    error,
  } = useSWRMutation(
    orderQueryKeys.initializeOrderPayment,
    initializeOrderPaymentMutationFn
  );

  return {
    initializeOrderPayment,
    isInitializingOrderPayment,
    isError: !!error,
    error,
  };
};
