import { Media } from "./common";

export type Category = {
  name: string;
  uuid: string;
  slug: string;
  description: string;
  media?: Media | null;
  parent_category_id?: string;
  parent_category?: {
    uuid: string;
    name: string;
  } | null;
  version?: string;
  sub_categories: Category[];
};
