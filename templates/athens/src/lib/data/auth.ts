import { CustomerPhoneLogin, CustomerPhoneVerifyOtp } from "@etailify/types";
import useSWRMutation from "swr/mutation";
import { sdk } from "../sdk-config";

const authQueryKeys = {
  otpLoginWithPhone: "otpLoginWithPhone",
  verifyOtpWithPhone: "verifyOtpWithPhone",
};

// otp login with phone

export const otpLoginWithPhoneMutationFn = async (
  _: string,
  {
    arg,
  }: {
    arg: CustomerPhoneLogin;
  }
) => {
  return await sdk.auth.login.otpLoginWithPhone(arg);
};

export const useOtpLoginWithPhone = () => {
  const {
    trigger: otpLoginWithPhone,
    isMutating: isPhoneSubmitting,
    error,
  } = useSWRMutation(
    authQueryKeys.otpLoginWithPhone,
    otpLoginWithPhoneMutationFn
  );

  return { otpLoginWithPhone, isPhoneSubmitting, isError: !!error, error };
};

// otp verify with phone

export const otpVerifyOtpWithPhoneMutationFn = async (
  _: string,
  {
    arg,
  }: {
    arg: CustomerPhoneVerifyOtp;
  }
) => {
  return await sdk.auth.login.verifyOtpWithPhone(arg);
};

export const useVerifyOtpWithPhone = () => {
  const {
    trigger: otpVerifyOtpWithPhone,
    isMutating: isOtpSubmitting,
    error,
  } = useSWRMutation(
    authQueryKeys.verifyOtpWithPhone,
    otpVerifyOtpWithPhoneMutationFn
  );

  return {
    otpVerifyOtpWithPhone,
    isOtpSubmitting,
    isError: !!error,
    error,
  };
};
