export namespace HttpTypes {
  export type SearchApiParams = {
    page?: number;
    size?: number;
    searchTerm?: string;
    params?: {
      key: string;
      value: string | string[];
    }[];
  };

  export type SearchApiResponse<T> = {
    response: T[];
    page_response: {
      total?: string;
      has_next_page?: boolean;
    };
  };
}
