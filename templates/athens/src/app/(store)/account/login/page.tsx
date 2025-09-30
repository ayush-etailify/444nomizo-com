"use client";

import { useOtpLoginWithPhone, useVerifyOtpWithPhone } from "@/lib/data/auth";
import { Button } from "@/lib/ui/button";
import Input from "@/lib/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/lib/ui/input-otp";
import { OtpCommunicationChannel } from "@etailify/types";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState({
    otp: "",
    otp_id: "",
  });

  const { otpLoginWithPhone, isPhoneSubmitting } = useOtpLoginWithPhone();
  const onPhoneNumberSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loginResponse = await otpLoginWithPhone({
      phone_number: phoneNumber,
      channel: OtpCommunicationChannel.OTP_COMMUNICATION_CHANNEL_WHATSAPP,
    });

    if (loginResponse.otp_response.response.otp) {
      setOtp({
        otp: "",
        otp_id: loginResponse.otp_response.response.uuid,
      });
    }
  };

  const { otpVerifyOtpWithPhone, isOtpSubmitting } = useVerifyOtpWithPhone();
  const onOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await otpVerifyOtpWithPhone(
      {
        otp: otp.otp,
        otp_id: otp.otp_id,
        phone_number: phoneNumber,
      },
      {
        onSuccess: () => {
          redirect("/account");
        },
      }
    );
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium capitalize">Login</h3>

      <div className="mt-8">
        {!otp.otp_id ? (
          <form onSubmit={onPhoneNumberSubmit}>
            <label className="flex flex-col gap-3">
              <Input
                placeholder="Enter phone number"
                className="md:w-96"
                maxLength={10}
                disabled={!!otp.otp_id}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-stone-500">
                You&apos;ll recieve an OTP at this number
              </p>
            </label>
            <Button
              type="submit"
              loading={isPhoneSubmitting}
              disabled={!phoneNumber || phoneNumber.length < 10}
              className="mt-4"
            >
              Send OTP
            </Button>
          </form>
        ) : (
          <form
            onSubmit={onOtpSubmit}
            className="animate-in slide-in-from-bottom-10 mt-4"
          >
            <label className="flex flex-col gap-3">
              <InputOTP
                maxLength={6}
                value={otp.otp}
                onChange={(value) =>
                  setOtp((prev) => ({ ...prev, otp: value }))
                }
                autoFocus
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPGroup key={index}>
                    <InputOTPSlot index={index} />
                  </InputOTPGroup>
                ))}
              </InputOTP>
              <p className="text-xs text-stone-500">
                Enter 6-digit OTP sent to {phoneNumber || "your phone"}
              </p>
            </label>
            <Button
              type="submit"
              loading={isOtpSubmitting}
              disabled={!otp.otp || otp.otp.length < 6}
              className="mt-4"
            >
              Verify OTP
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
