import { ApiClient } from "../utils/api-client";
import { TokenManager } from "../utils/token-manager";

export class AuthModule {
  private tokenManager: TokenManager;

  constructor(private apiClient: ApiClient) {
    this.tokenManager = new TokenManager(
      process.env.NODE_ENV === "development"
    );
  }

  login = {
    otpLoginWithPhone: async (payload: {
      phone_number: string;
      channel:
        | "OTP_COMMUNICATION_CHANNEL_WHATSAPP"
        | "OTP_COMMUNICATION_CHANNEL_SMS";
    }) => {
      const response = await this.apiClient
        .instance()
        .post(`/token_svc/v1/customer/login`, payload);

      return response.data;
    },

    verifyOtpWithPhone: async ({
      phone_number,
      otp,
      otp_id,
    }: {
      phone_number: string;
      otp: string;
      otp_id: string;
    }) => {
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
  };
}
