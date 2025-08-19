import { Category } from "@/lib/types/categories";
import { SearchParams, SearchResponse } from "@/lib/types/common";
import { Product } from "@/lib/types/products";
import { ApiClient } from "../utils/api-client";

export class StoreModule {
  constructor(private apiClient: ApiClient) {}

  products = {
    getProductBySlug: async (slug: string) => {
      const response = await this.apiClient
        .instance()
        .get(`/store_svc/v1/products/${slug}`);

      return response.data as Product;
    },
  };

  categories = {
    searchCategories: async ({ page = 0, size = 10 }: SearchParams) => {
      // `/store_svc/v1/stores/${this.apiClient.config.storeSlug}/categories/search`,

      const response = await this.apiClient
        .instance()
        .put(`/store_svc/v1/stores/444nomizo-1/categories/search`, {
          page,
          size,
        });

      return response.data as SearchResponse<Category>;
    },
    searchCategoryProducts: async (
      slug: string,
      { page = 0, size = 10 }: SearchParams
    ) => {
      const response = await this.apiClient
        .instance()
        .put(`/store_svc/v1/categories/${slug}/products/search`, {
          // shouldn't there be a store-slug in the endpoint?
          page,
          size,
        });

      return response.data as SearchResponse<Product>;
    },
  };
}
