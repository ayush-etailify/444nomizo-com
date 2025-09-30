import { Media } from "@/document-svc";

export type ParentCategory = {
  uuid: string;
  name: string;
};

export type BaseCategory = {
  name: string;
  description: string;
  slug?: string;
  uuid?: string;
  media?: Media | null;
  parent_category_id?: string;
  parent_category?: ParentCategory | null;
  version?: string;
};

export type Category = BaseCategory & {
  sub_categories: Category[];
};
