import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { TokenManager } from "./token-manager";
import { RefreshTokenRequest, SDKConfig, TokenResponse } from "../types";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private tokenManager: TokenManager;
  private config: SDKConfig;

  constructor(config: SDKConfig) {
    this.config = config;
    this.tokenManager = new TokenManager(config.isDevelopment);
    this.axiosInstance = this.createAxiosInstance();
  }

  private createAxiosInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout || 15000,
    });

    this.setupInterceptors(instance);
    return instance;
  }

  private setupInterceptors(instance: AxiosInstance): void {
    instance.interceptors.request.use(
      (request: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        // if (!this.tokenManager.isServer()) {
        //   const accessToken = this.tokenManager.getAccessToken();
        //   if (accessToken) request.headers["Authorization"] = `${accessToken}`;
        // }

        const accessToken = this.tokenManager.getAccessToken();
        if (accessToken) request.headers["Authorization"] = `${accessToken}`;
        // hot-fix: temporary for passing browser get calls via ngrok
        request.headers["ngrok-skip-browser-warning"] = "true";
        return request;
      },
      (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => response,
      async (error: AxiosError): Promise<AxiosResponse | void> => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !this.tokenManager.isServer()
        ) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.tokenManager.getRefreshToken();
            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            const refreshUrl = `${this.config.baseUrl}/token_svc/v1/store_users/tokens/refresh`;
            const response = await axios.post<TokenResponse>(refreshUrl, {
              request: {
                refresh_token: refreshToken,
              },
            } as RefreshTokenRequest);

            const { access_token: newAccessToken } = response.data.response;
            this.tokenManager.setAccessToken(newAccessToken);

            if (originalRequest.headers?.common) {
              originalRequest.headers.common["Authorization"] =
                `${newAccessToken}`;
            }

            return instance(originalRequest);
          } catch (refreshError) {
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private handleAuthError(): void {
    if (!this.tokenManager.isServer()) {
      // this.tokenManager.removeAuthTokens();
    }
  }

  instance() {
    return this.axiosInstance;
  }
}
