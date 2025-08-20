import { Category } from "@/lib/types/categories";
import { SearchParams, SearchResponse } from "@/lib/types/common";
import { Product } from "@/lib/types/products";

export const searchCategoriesQueryFn = async ({
  page = 0,
  size = 10,
}: SearchParams) => {
  const response = await fetch(
    `${process.env.STOREFRONT_BASE_API_URL}/store_svc/v1/stores/${process.env.STOREFRONT_SLUG}/categories/search`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page: page,
        size: size,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as SearchResponse<Category>;
};

export const getCategoryProductsQueryFn = async (
  slug: string,
  { page = 0, size = 10 }: SearchParams,
) => {
  const response = await fetch(
    `${process.env.STOREFRONT_BASE_API_URL}/store_svc/v1/categories/${slug}/products/search`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page: page,
        size: size,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as SearchResponse<Product>;
};
