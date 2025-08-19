import { Product } from "@/lib/types/products";

export const getProductBySlugQueryFn = async (slug: string) => {
  const response = await fetch(
    `${process.env.STOREFRONT_BASE_API_URL}/store_svc/v1/products/${slug}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data as Product;
};
