import { CartItem } from "@/lib/stores/use-cart-store";
import { storefrontClientAPI } from "@/lib/utils/api-instance";

export const createOrderQueryFn = async (items: CartItem[]) => {
  const orderItems = items.map((item) => ({
    product_id: item.product_id,
    product_type: item.product_type,
    quantity: item.quantity,
    sku_id: item.sku_id,
  }));

  const response = await storefrontClientAPI.post(
    `/customer_order_svc/v1/stores/${process.env.NEXT_PUBLIC_STOREFRONT_ID}/orders`,
    orderItems
  );

  return response.data;
};

export const upsertDeliveryAddressQueryFn = async (
  orderId: string,
  payload: any
) => {
  const response = await storefrontClientAPI.patch(
    `/customer_order_svc/v1/stores/${process.env.NEXT_PUBLIC_STOREFRONT_ID}/orders/${orderId}/customer`,
    payload
  );

  return response.data;
};

export class InitializePaymentResponse {
  amount: string;
  order_id: string;
  payment_id: string;
  payment_type: string;
  provider_order_id: string;
  uuid: string;

  constructor(data: {
    amount: string;
    order_id: string;
    payment_id: string;
    payment_type: string;
    provider_order_id: string;
    uuid: string;
  }) {
    this.amount = data.amount;
    this.order_id = data.order_id;
    this.payment_id = data.payment_id;
    this.payment_type = data.payment_type;
    this.provider_order_id = data.provider_order_id;
    this.uuid = data.uuid;
  }

  getAmount(): number {
    return Number(this.amount);
  }
}

export const initializePaymentQueryFn = async (orderId: string) => {
  const response = await storefrontClientAPI.post(
    `/customer_order_svc/v1/stores/${process.env.NEXT_PUBLIC_STOREFRONT_ID}/orders/${orderId}/payments`,
    {
      paymentMode: "PAYMENT_MODE_WEB_SDK",
      preferredProvider: "PROVIDER_RAZORPAY",
    }
  );

  return new InitializePaymentResponse(response.data);
};
