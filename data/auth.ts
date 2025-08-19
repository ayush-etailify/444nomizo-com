import { sdk } from "@/lib/config";

export const verifyOtpLogin = async (payload: {
  phone_number: string;
  otp: string;
  otp_id: string;
}) => {
  const otpResponse = await sdk.auth.login.verifyOtpWithPhone(payload);

  return otpResponse;
};
