export enum VariationGroupType {
  VARIATION_GROUP_TYPE_SIZE = "VARIATION_GROUP_TYPE_SIZE",
  VARIATION_GROUP_TYPE_COLOR = "VARIATION_GROUP_TYPE_COLOR",
  VARIATION_GROUP_TYPE_BOTTLE_SIZE = "VARIATION_GROUP_TYPE_BOTTLE_SIZE",
  VARIATION_GROUP_TYPE_PACKET_SIZE = "VARIATION_GROUP_TYPE_PACKET_SIZE",
}

export type VariationGroupOption = {
  name: string;
  uuid?: string;
  variation_group_id?: string;
};

export type VariationGroup = {
  variation_group_type: VariationGroupType;
  name: string;
  description: string;
  variations: VariationGroupOption[];
  uuid?: string;
  options_count: string;
  products_count: string;
};
