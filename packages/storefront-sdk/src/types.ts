export type SDKConfig = {
  baseUrl: string;
  storeSlug: string;
  storeId: string;
  timeout?: number;
  isDevelopment?: boolean;
};

export type TokenResponse = {
  response: {
    access_token: string;
  };
};

export type RefreshTokenRequest = {
  request: {
    refresh_token: string | null;
  };
};
