import { storefrontClientAPI } from "@/lib/utils/api-instance";

export const authQueryKeys = {
  loginWithOTP: "loginWithOTP",
  validateOTPLogin: "validateOTPLogin",
} as const;

export const loginWithOTPQueryFn = async (payload: {
  phone_number: string;
  channel:
    | "OTP_COMMUNICATION_CHANNEL_WHATSAPP"
    | "OTP_COMMUNICATION_CHANNEL_SMS";
}) => {
  const response = await storefrontClientAPI.post(
    `/token_svc/v1/customer/login`,
    payload
  );
  return response.data;
};

export const validateOTPLoginQueryFn = async ({
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

  const response = await storefrontClientAPI.put(
    `/token_svc/v1/customer/login/otp`,
    payload
  );
  return response.data;
};
