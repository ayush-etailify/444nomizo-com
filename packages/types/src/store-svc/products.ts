import { Bool } from "@/common";
import { Media } from "@/document-svc";
import { Category } from "./categories";
import { VariationGroupOption, VariationGroupType } from "./variations-groups";

export enum ProductInventoryStatus {
  INVENTORY_STATUS_OUT_OF_STOCK = "INVENTORY_STATUS_OUT_OF_STOCK",
  INVENTORY_STATUS_IN_STOCK = "INVENTORY_STATUS_IN_STOCK",
}

export enum ProductType {
  PRODUCT_TYPE_REGULAR = "PRODUCT_TYPE_REGULAR",
  PRODUCT_TYPE_VARIATION = "PRODUCT_TYPE_VARIATION",
  PRODUCT_TYPE_COMBO = "PRODUCT_TYPE_COMBO",
}

export enum ProductStatus {
  PRODUCT_STATUS_DRAFT = "PRODUCT_STATUS_DRAFT",
  PRODUCT_STATUS_LIVE = "PRODUCT_STATUS_LIVE",
  PRODUCT_STATUS_ARCHIVED = "PRODUCT_STATUS_ARCHIVED",
}

export type ProductVariation = VariationGroupOption;

export type ProductVariationGroupOption = {
  variation: ProductVariation;
  selected: Bool;
};

export type ProductVariationGroup = {
  uuid: string;
  name: string;
  variations: ProductVariationGroupOption[];
  variation_group_type: VariationGroupType;
};

export type ProductPrice = {
  max_retail_price: string;
  cost_price: string;
  selling_price: string;
};

export type ProductSKU = ProductPrice & {
  inventory_status: ProductInventoryStatus;
  uuid?: string;
  id?: string;
  product_id?: string;
  media: Media[];
  variations: ProductVariation[];
};

export type ProductTaxCategory = {
  name: string;
  uuid?: string;
};

export type Product = {
  name: string;
  product_type: ProductType;
  product_status: ProductStatus;
  discount_applicable: Bool;
  skus: ProductSKU[];
  slug?: string;
  uuid?: string;
  description?: string;
  category_id?: string;
  category?: Category | null;
  tax_category_id?: string;
  tax_category?: ProductTaxCategory | null;
  selected_variation_groups: ProductVariationGroup[];
};
