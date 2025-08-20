"use client";

import { loginWithOTPQueryFn, validateOTPLoginQueryFn } from "@/data/auth";
import {
  createOrderQueryFn,
  initializePaymentQueryFn,
  upsertDeliveryAddressQueryFn,
} from "@/data/checkout";
import { useCartStore } from "@/lib/stores/use-cart-store";
import { Button } from "@/lib/ui/button";
import Input from "@/lib/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/lib/ui/input-otp";
import { setTokens } from "@/lib/utils/auth";
import { readPrice } from "@/lib/utils/text-format";
import { Loader2Icon, ShieldCheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useState } from "react";

const CHECKOUT_STEPS = {
  LOGIN: "LOGIN",
  SHIPPING: "SHIPPING",
  PAYMENT: "PAYMENT",
} as const;

export default function CheckoutPage() {
  const { items, clearCart, getTotal } = useCartStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentStep, setCurrentStep] = useState<
    (typeof CHECKOUT_STEPS)[keyof typeof CHECKOUT_STEPS]
  >(CHECKOUT_STEPS.LOGIN);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState({
    otp: "",
    otp_id: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orderData, setOrderData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [billData, setBillData] = useState<any>(null);
  const [customerData, setCustomerData] = useState<{
    first_name: string;
    last_name: string;
  }>({
    first_name: "",
    last_name: "",
  });
  const [addressData, setAddressData] = useState<{
    address_line_1: string;
    address_line_2?: string;
    city: string;
    region: string;
    country: "INDIA";
    zip_code: string;
  }>({
    address_line_1: "",
    address_line_2: "",
    city: "",
    region: "",
    country: "INDIA",
    zip_code: "",
  });

  const onPhoneNumberSubmit = async () => {
    setIsSubmitting(true);
    if (!phoneNumber || phoneNumber.length < 10) {
      setIsSubmitting(false);
      return;
    }

    const response = await loginWithOTPQueryFn({
      phone_number: phoneNumber,
      channel: "OTP_COMMUNICATION_CHANNEL_SMS",
    });

    if (response.otp_response.response.otp) {
      setOtp({
        otp: "",
        otp_id: response.otp_response.response.uuid,
      });
    }
    setIsSubmitting(false);
  };

  const onOtpSubmit = async () => {
    if (!otp.otp || !otp.otp_id) {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    const otpValidationResponse = await validateOTPLoginQueryFn({
      otp: otp.otp,
      otp_id: otp.otp_id,
      phone_number: phoneNumber,
    });

    if (otpValidationResponse.token_response.response.access_token) {
      const customer =
        otpValidationResponse.token_response.response.user.customer;

      setTokens(
        otpValidationResponse.token_response.response.access_token,
        otpValidationResponse.token_response.response.refresh_token
      );

      if (!items.length) {
        setIsSubmitting(false);
        alert("Please add items to the cart");
        return;
      }

      const orderResponse = await createOrderQueryFn(items);

      if (orderResponse.bill) {
        setBillData(orderResponse.bill);
        setOrderData(orderResponse);
      }

      if (
        customer.status === "CUSTOMER_STATUS_PROFILE_COMPLETE" ||
        !customer.first_name.startsWith("Unspecified")
      ) {
        setCustomerData({
          first_name: customer.first_name,
          last_name: customer.last_name,
        });
        setAddressData({
          address_line_1: customer.addresses[0].address.address_line_1,
          address_line_2: customer.addresses[0].address.address_line_2,
          city: customer.addresses[0].address.city,
          region: customer.addresses[0].address.region,
          country: customer.addresses[0].address.country,
          zip_code: customer.addresses[0].address.zip_code,
        });
      }

      setCurrentStep(CHECKOUT_STEPS.SHIPPING);
      setIsSubmitting(false);
    }
  };

  const onAddressSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await upsertDeliveryAddressQueryFn(orderData.uuid, {
        first_name: customerData.first_name,
        last_name: customerData.last_name,
        addresses: [
          {
            address: addressData,
          },
        ],
      });
      if (response.bill) {
        setBillData(response.bill);
        setOrderData(response);
        setCurrentStep(CHECKOUT_STEPS.PAYMENT);
      }
    } catch (error) {
      console.error("Error submitting address:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPaymentSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await initializePaymentQueryFn(orderData.uuid);
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: response.getAmount(),
        currency: "INR",
        name: "444Nomizo",
        description: "Order Payment",
        order_id: response.provider_order_id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: function (res: any) {
          clearCart();
          window.location.href = `/checkout/confirm?id=${res.razorpay_payment_id}`;
        },
        prefill: {
          contact: phoneNumber,
        },
        theme: {
          color: "#1f7ead",
        },
      };
      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert("Payment gateway failed to load. Please try again.");
      }
    } catch (error) {
      console.error("Error initializing payment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!items || !items?.length) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2Icon className="size-6 animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center h-screen justify-center">
        <h3 className="text-base font-medium">No items in your cart</h3>
        <p className="text-stone-500 mt-3 sm:w-xl text-center">
          You don&apos;t have anything in your cart. Let&apos;s change that, use
          the link below to start browsing our products.
        </p>
        <Button className="mt-6 sm:w-fit" asChild>
          <Link href="/categories">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <div className="sticky top-0 flex h-12 w-full items-center justify-between bg-stone-800 px-6 text-xs sm:text-sm text-white">
        <div className="font-medium uppercase">444Nomizo</div>
        <div className="flex items-center gap-1.5">
          <ShieldCheckIcon className="size-4" />
          <div>Checkout</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 text-sm">
        <div
          id="order-summary"
          className="sticky top-12 flex order-2 sm:order-1 sm:h-[calc(100dvh-48px)] justify-center overflow-y-auto bg-stone-100"
        >
          <div className="px-6 sm:px-12 py-10 pb-10 sm:pb-20">
            <div id="order-summary__heading">
              <h3 className="text-xl font-medium">Order Summary</h3>
              <p className="mt-1 text-sm text-stone-500">
                By placing your order, you agree to 444Nomizo&apos;s privacy and
                policy.
              </p>
            </div>
            <div id="order-summary__cart-items" className="mt-8 space-y-4">
              {items.map((item) => (
                <div key={item.product_id} className="flex gap-4">
                  <div className="size-18 rounded-md border border-stone-200 overflow-clip">
                    <Image
                      src={item.meta.media_public_url || "/img/placeholder.png"}
                      width={72}
                      height={72}
                      quality={25}
                      alt={item.meta.product_name}
                      className="size-full bg-white object-cover"
                    />
                  </div>

                  <div>
                    <div className="line-clamp-2">{item.meta.product_name}</div>
                    <div className="mt-2 flex gap-2 text-sm">
                      <span className="text-stone-500">{item.quantity} x</span>
                      <span id="selling_price">
                        {readPrice(item.meta.selling_price, {
                          format: true,
                        })}
                      </span>
                      <span
                        id="cost_price"
                        className="font-normal text-stone-500 line-through"
                      >
                        {readPrice(item.meta.max_retail_price, {
                          format: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div id="order-summary__bill" className="mt-8 space-y-1">
              <div className="flex items-center justify-between font-medium">
                <div>Subtotal</div>
                <div>
                  {billData?.product_total
                    ? readPrice(billData.product_total, {
                        format: true,
                      })
                    : readPrice(getTotal().toString(), {
                        format: true,
                      })}
                </div>
              </div>
              {billData && (
                <>
                  {billData?.tax_total && (
                    <div className="flex justify-between">
                      <div>Tax</div>
                      <div>
                        {readPrice(billData?.tax_total, {
                          format: true,
                        })}
                      </div>
                    </div>
                  )}
                  {billData?.discount_total && (
                    <div className="flex justify-between">
                      <div>Discount</div>
                      <div>
                        {readPrice(billData?.discount_total, {
                          format: true,
                        })}
                      </div>
                    </div>
                  )}
                  {billData?.charge_total && (
                    <div className="flex justify-between">
                      <div>Charges</div>
                      <div>
                        {readPrice(billData.charge_total, {
                          format: true,
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center justify-between text-base font-medium mt-3 pt-3 border-stone-300 border-t border-dashed">
                <div>Total</div>
                <div>
                  {readPrice(billData?.net_total, {
                    format: true,
                  }) || <span className="text-stone-500 font-normal">--</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="checkout-info"
          className="col-span-2 order-1 sm:order-2 flex flex-col justify-start"
        >
          <div className="w-full space-y-8 px-6 sm:px-12 py-10 pb-10 sm:pb-20">
            {currentStep === CHECKOUT_STEPS.LOGIN ? (
              <div id={CHECKOUT_STEPS.LOGIN}>
                <h3 className="text-xl font-medium">Login</h3>
                <div className="mt-6">
                  {!otp.otp_id ? (
                    <>
                      <label className="flex flex-col gap-2">
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
                        loading={isSubmitting}
                        disabled={!phoneNumber || phoneNumber.length < 10}
                        onClick={onPhoneNumberSubmit}
                        className="mt-4"
                      >
                        Send OTP
                      </Button>
                    </>
                  ) : (
                    <div className="animate-in slide-in-from-bottom-10 mt-4">
                      <label className="flex flex-col gap-2">
                        <InputOTP
                          maxLength={6}
                          value={otp.otp}
                          onChange={(value) =>
                            setOtp((prev) => ({ ...prev, otp: value }))
                          }
                        >
                          {Array.from({ length: 6 }).map((_, index) => (
                            <InputOTPGroup key={index}>
                              <InputOTPSlot index={index} />
                            </InputOTPGroup>
                          ))}
                        </InputOTP>
                        <p className="text-xs text-stone-500 mt-2">
                          Enter 6-digit OTP sent to{" "}
                          {phoneNumber || "your phone"}
                        </p>
                      </label>
                      <Button
                        loading={isSubmitting}
                        disabled={!otp.otp || otp.otp.length < 6}
                        onClick={onOtpSubmit}
                        className="mt-4"
                      >
                        Verify OTP
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-bottom-2">
                <div
                  id={CHECKOUT_STEPS.SHIPPING}
                  className={
                    currentStep !== CHECKOUT_STEPS.SHIPPING
                      ? "opacity-60 pointer-events-none"
                      : ""
                  }
                >
                  <div className="flex gap-2 sm:flex-row flex-col justify-between">
                    <h3 className="text-xl font-medium">Shipping</h3>
                    <span className="text-xs text-stone-500">
                      Logged in with {phoneNumber}
                    </span>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <label className="flex flex-col gap-2">
                      <Input
                        placeholder="Enter first name"
                        value={customerData.first_name}
                        onChange={(e) =>
                          setCustomerData((prev) => ({
                            ...prev,
                            first_name: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <Input
                        placeholder="Enter last name"
                        value={customerData.last_name}
                        onChange={(e) =>
                          setCustomerData((prev) => ({
                            ...prev,
                            last_name: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="col-span-full flex flex-col gap-2">
                      <Input
                        placeholder="Flat, House no, Building"
                        value={addressData.address_line_1}
                        onChange={(e) =>
                          setAddressData((prev) => ({
                            ...prev,
                            address_line_1: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="col-span-full flex flex-col gap-2">
                      <Input
                        placeholder="Area, Street, Sector"
                        value={addressData.address_line_2}
                        onChange={(e) =>
                          setAddressData((prev) => ({
                            ...prev,
                            address_line_2: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <Input
                        placeholder="Enter pincode"
                        value={addressData.zip_code}
                        onChange={(e) =>
                          setAddressData((prev) => ({
                            ...prev,
                            zip_code: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <Input
                        placeholder="Enter city"
                        value={addressData.city}
                        onChange={(e) =>
                          setAddressData((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <Input
                        placeholder="Enter state"
                        value={addressData.region}
                        onChange={(e) =>
                          setAddressData((prev) => ({
                            ...prev,
                            region: e.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <Input
                        placeholder="Enter country"
                        value={addressData.country}
                        disabled
                      />
                    </label>
                  </div>
                  {currentStep === CHECKOUT_STEPS.SHIPPING && (
                    <Button
                      loading={isSubmitting}
                      onClick={onAddressSubmit}
                      className="mt-6"
                    >
                      Continue to payment
                    </Button>
                  )}
                </div>
                <div
                  id={CHECKOUT_STEPS.PAYMENT}
                  className={
                    currentStep !== CHECKOUT_STEPS.PAYMENT
                      ? "opacity-60 pointer-events-none"
                      : ""
                  }
                >
                  <h3 className="text-xl font-medium">Payment</h3>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                      id="payment__online"
                      className="has-checked:bg-brand-50/70 flex cursor-pointer items-start gap-3 rounded-md border border-stone-200 p-4 select-none"
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value="pay-online"
                      />
                      <div className="-mt-1">
                        <div>Pay Online</div>
                        <p className="mt-1 text-xs text-stone-500">
                          Secure and encrypted
                        </p>
                      </div>
                      <div className="mt-auto ml-auto flex gap-2">
                        <div className="flex h-5 items-center justify-center rounded-sm border border-stone-200 bg-stone-100 px-1 text-[10px]">
                          UPI
                        </div>
                        <div className="flex h-5 items-center justify-center rounded-sm border border-stone-200 bg-stone-100 px-1 text-[10px]">
                          VISA
                        </div>
                        <div className="flex h-5 items-center justify-center rounded-sm border border-stone-200 bg-stone-100 px-1 text-[10px]">
                          AMEX
                        </div>
                      </div>
                    </label>
                    <label
                      id="payment__pay-on-delivery"
                      className="has-checked:bg-brand-50/70 flex cursor-pointer items-start gap-3 rounded-md border border-stone-200 p-4 select-none"
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value="pay-on-delivery"
                      />
                      <div className="-mt-1">
                        <div>Pay On Delivery</div>
                        <p className="mt-1 text-xs text-stone-500">
                          Pay via cash or UPI on delivery
                        </p>
                      </div>
                    </label>
                  </div>
                  {currentStep === CHECKOUT_STEPS.PAYMENT && (
                    <Button
                      loading={isSubmitting}
                      onClick={onPaymentSubmit}
                      className="mt-6"
                    >
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
