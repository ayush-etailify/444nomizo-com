import { CartItem } from "@/lib/stores/use-cart-store";
import { ApiClient } from "../utils/api-client";

const STORE_ID = "1f9202c9-8d56-410b-98ca-c36ed7744869";

export type CartProductAdded = {
  product_id: string;
  product_type: string;
  quantity: string;
  sku_id: string; // sku uuid
  instructions?: string;
};

export type CartProductUpdated = {
  uuid: string;
  product_id: string;
  product_type: string;
  quantity: string;
  sku_id: string; // sku uuid
  instructions?: string;
};

export type UpsertCartPayload = {
  products_added: CartProductAdded[];
  products_updated: CartProductUpdated[];
  products_removed: string[];
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

export class CustomerModule {
  constructor(private apiClient: ApiClient) {}

  order = {
    createOrder: async (items: CartItem[]) => {
      const payload = items.map((item) => ({
        product_id: item.product_id,
        product_type: item.product_type,
        quantity: item.quantity,
        sku_id: item.sku_id,
      }));

      const response = await this.apiClient
        .instance()
        .post(`/customer_order_svc/v1/stores/${STORE_ID}/orders`, payload);

      return response.data;
    },
    getOrders: async () => {
      const response = await this.apiClient
        .instance()
        .get(`/customer_order_svc/v1/stores/${STORE_ID}/orders/current`);

      return response.data;
    },
    upsertCart: async (orderId: string, payload: UpsertCartPayload) => {
      const response = await this.apiClient
        .instance()
        .post(
          `/customer_order_svc/v1/stores/${STORE_ID}/orders/${orderId}/cart`,
          payload
        );

      return response.data;
    },
    initializePayment: async (orderId: string) => {
      const response = await this.apiClient
        .instance()
        .post(
          `/customer_order_svc/v1/stores/${STORE_ID}/orders/${orderId}/payments`,
          {
            paymentMode: "PAYMENT_MODE_WEB_SDK",
            preferredProvider: "PROVIDER_RAZORPAY",
          }
        );

      return new InitializePaymentResponse(response.data);
    },
  };

  account = {
    upsertDeliveryAddress: async (orderId: string, payload: any) => {
      const response = await this.apiClient
        .instance()
        .patch(
          `/customer_order_svc/v1/stores/1f9202c9-8d56-410b-98ca-c36ed7744869/orders/${orderId}/customer`,
          payload
        );
      return response.data;
    },
  };
}
