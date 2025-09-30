import { CustomerPhoneLogin, CustomerPhoneVerifyOtp } from "@etailify/types";
import { ApiClient } from "../services/api-client";
import { TokenManager } from "../services/token-manager";
import { SDKConfig } from "../types";

export class AuthModule {
  private tokenManager: TokenManager;

  constructor(
    private apiClient: ApiClient,
    private config: SDKConfig
  ) {
    this.tokenManager = new TokenManager(this.config.isDevelopment);
  }

  login = {
    otpLoginWithPhone: async (payload: CustomerPhoneLogin) => {
      const response = await this.apiClient
        .instance()
        .post(`/token_svc/v1/customer/login`, payload);

      return response.data;
    },

    verifyOtpWithPhone: async ({
      phone_number,
      otp,
      otp_id,
    }: CustomerPhoneVerifyOtp) => {
      const payload = {
        validate_request: {
          request: {
            otp_id,
            otp,
          },
        },
        phone_number,
      };

      const response = await this.apiClient
        .instance()
        .put("/token_svc/v1/customer/login/otp", payload);

      const { access_token, refresh_token, user } =
        response.data.token_response.response;

      if (access_token && refresh_token) {
        this.tokenManager.setAuthTokens(access_token, refresh_token);
      }

      if (user.customer) {
        localStorage.setItem("customerData", JSON.stringify(user.customer));
      }

      return response.data;
    },

    isCustomerLoggedIn: () => !!this.tokenManager.getAccessToken(),

    logout: () => {
      localStorage.clear();
      this.tokenManager.removeAuthTokens();
    },
  };
}
