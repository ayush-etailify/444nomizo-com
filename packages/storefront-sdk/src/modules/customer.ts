import {
  Customer,
  CustomerAddress,
  CustomerCurrentOrder,
  CustomerCurrentOrderUpsertPayload,
  CustomerOrderProductItem,
  HttpTypes,
} from "@etailify/types";
import { ApiClient } from "../services/api-client";
import { SDKConfig } from "../types";

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
  constructor(
    private apiClient: ApiClient,
    private config: SDKConfig
  ) {}

  order = {
    createOrder: async (payload: CustomerOrderProductItem[]) => {
      const response = await this.apiClient
        .instance()
        .post(
          `/customer_order_svc/v1/stores/${this.config.storeId}/orders`,
          payload
        );

      return response.data as CustomerCurrentOrder;
    },
    getCurrentOrder: async () => {
      const response = await this.apiClient
        .instance()
        .get(
          `/customer_order_svc/v1/stores/${this.config.storeId}/orders/current`
        );

      return response.data as { order: CustomerCurrentOrder };
    },
    upsertCart: async (
      orderId: string,
      payload: CustomerCurrentOrderUpsertPayload
    ) => {
      const response = await this.apiClient
        .instance()
        .put(
          `/customer_order_svc/v1/stores/${this.config.storeId}/orders/${orderId}/cart`,
          payload
        );

      return response.data as CustomerCurrentOrder;
    },
    initializePayment: async (orderId: string) => {
      const response = await this.apiClient
        .instance()
        .post(
          `/customer_order_svc/v1/stores/${this.config.storeId}/orders/${orderId}/payments`,
          {
            paymentMode: "PAYMENT_MODE_WEB_SDK",
            preferredProvider: "PROVIDER_RAZORPAY",
          }
        );

      return new InitializePaymentResponse(response.data);
    },
    upsertDeliveryAddress: async (
      orderId: string,
      payload: CustomerAddress
    ) => {
      const response = await this.apiClient.instance().put(
        `/customer_order_svc/v1/stores/${this.config.storeId}/orders/${orderId}/delivery_address`,

        { address: payload }
      );
      return response.data;
    },
  };

  account = {
    upsertCustomerDetails: async (orderId: string, payload: Customer) => {
      const response = await this.apiClient
        .instance()
        .patch(
          `/customer_order_svc/v1/stores/${this.config.storeId}/orders/${orderId}/customer`,
          payload
        );
      return response.data;
    },
    searchOrders: async ({
      page = 0,
      size = 10,
    }: HttpTypes.SearchApiParams) => {
      const response = await this.apiClient
        .instance()
        .put(
          `/customer_order_svc/v1/stores/${this.config.storeId}/orders/search`,
          {
            page,
            size,
          }
        );

      return response.data as HttpTypes.SearchApiResponse<CustomerCurrentOrder>;
    },
  };
}
