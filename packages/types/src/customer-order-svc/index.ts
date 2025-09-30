import { Address, Gender, IdentityType } from "@/common";
import { Product, ProductType } from "@/store-svc/products";

/****************** customer *****************/

export enum CustomerStatus {
  CUSTOMER_STATUS_PROFILE_UNSPECIFIED = "CUSTOMER_STATUS_PROFILE_UNSPECIFIED",
  CUSTOMER_STATUS_PROFILE_INCOMPLETE = "CUSTOMER_STATUS_PROFILE_INCOMPLETE",
  CUSTOMER_STATUS_PROFILE_COMPLETE = "CUSTOMER_STATUS_PROFILE_COMPLETE",
}

export type CustomerIdentity = {
  identity_type: IdentityType;
  identity_value: string;
};

export type CustomerAddress = Address;

export type Customer = {
  first_name: string;
  last_name: string;
  addresses: {
    address: CustomerAddress;
    preferred?: boolean;
    tag?: string;
  }[];
  gender?: Gender;
  status?: CustomerStatus;
  identities?: CustomerIdentity[];
  uuid?: string;
  date_of_birth?: string;
  dp_media_id?: string;
  dp_url?: string;
};

/****************** customer order *****************/

export enum CustomerOrderStatus {
  CUSTOMER_ORDER_STATUS_UNSPECIFIED = "CUSTOMER_ORDER_STATUS_UNSPECIFIED",
  ORDER_STATUS_CUSTOMER_CREATED = "ORDER_STATUS_CUSTOMER_CREATED",
  ORDER_STATUS_CUSTOMER_CONFIRMED = "ORDER_STATUS_CUSTOMER_CONFIRMED",
  ORDER_STATUS_CUSTOMER_CANCELLED = "ORDER_STATUS_CUSTOMER_CANCELLED",
}

export type CustomerOrderCustomer = {
  uuid: string;
  order_id: string;
  customer_id: string;
  customer: Customer;
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
  uuid?: string;
  // need explaintation for the following
  // tax?: string;
  // discount?: string;
  // gross_price?: string;
  // net_price?: string;
};

export type CustomerCurrentOrder = {
  products: CustomerOrderProduct[];
  cancelled_products?: any[];
  returned_products?: any[];
  replaced_products?: any[];
  uuid?: string;
  order_status?: string;
  bill?: CustomerOrderBill;
  customer?: CustomerOrderCustomer;
  created_at?: string;
};

export type CustomerOrderProductItem = {
  product_id: string;
  product_type: string;
  quantity: string;
  sku_id: string;
  instructions?: string;
};

export type CustomerCurrentOrderUpsertPayload = {
  products_added?: CustomerOrderProductItem[];
  products_updated?: (CustomerOrderProductItem & { uuid: string })[];
  products_deleted?: string[];
};
