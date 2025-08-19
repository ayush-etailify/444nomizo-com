export interface SDKConfig {
  baseUrl: string;
  storeSlug: string;
  storeId: string;
  timeout?: number;
  onTokenRefresh?: (accessToken: string) => void;
  onAuthError?: () => void;
  onLogout?: () => void;
}

export interface TokenResponse {
  response: {
    access_token: string;
  };
}

export interface RefreshTokenRequest {
  request: {
    refresh_token: string | null;
  };
}

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}
