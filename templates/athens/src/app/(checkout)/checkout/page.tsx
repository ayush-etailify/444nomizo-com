"use client";

import { useOtpLoginWithPhone, useVerifyOtpWithPhone } from "@/lib/data/auth";
import {
  useCreateOrder,
  useUpsertCustomerDetails,
  useUpsertDeliveryAddress,
} from "@/lib/data/order";
import { useCart } from "@/lib/hooks/use-cart";
import { useServerCart } from "@/lib/hooks/use-server-cart";
import { sdk } from "@/lib/sdk-config";
import { Button } from "@/lib/ui/button";
import Input from "@/lib/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/lib/ui/input-otp";
import { isCustomerLoggedIn } from "@/lib/utils/common";
import { readPrice } from "@/lib/utils/text-format";
import {
  Customer,
  CustomerAddress,
  OtpCommunicationChannel,
} from "@etailify/types";
import { Loader2Icon, PlusIcon, ShieldCheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

const CHECKOUT_STEP = {
  LOGIN: "LOGIN",
  SHIPPING: "SHIPPING",
  PAYMENT: "PAYMENT",
} as const;

const SHIPPING_STATE = {
  EXISTING: "EXISTING",
  NEW: "NEW",
} as const;

export default function CheckoutPage() {
  const cart = useCart();

  const [currentStep, setCurrentStep] = useState<
    (typeof CHECKOUT_STEP)[keyof typeof CHECKOUT_STEP]
  >(CHECKOUT_STEP.LOGIN);
  const [shippingState, setShippingState] = useState<
    (typeof SHIPPING_STATE)[keyof typeof SHIPPING_STATE]
  >(SHIPPING_STATE.EXISTING);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState({
    otp: "",
    otp_id: "",
  });
  const [customerData, setCustomerData] = useState<
    Pick<Customer, "first_name" | "last_name">
  >({
    first_name: "",
    last_name: "",
  });
  const [addressData, setAddressData] = useState<CustomerAddress>({
    address_line_1: "",
    address_line_2: "",
    city: "",
    region: "",
    country: "INDIA",
    zip_code: "",
  });
  const [selectedAddress, setSelectedAddress] =
    useState<CustomerAddress | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);

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
  const { createOrder, isCreatingOrder } = useCreateOrder();
  const onOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const otpResponse = await otpVerifyOtpWithPhone({
      otp: otp.otp,
      otp_id: otp.otp_id,
      phone_number: phoneNumber,
    });

    if (otpResponse?.token_response?.response?.access_token) {
      const orderPayload = cart.cartItems.map((productItem) => ({
        product_id: productItem.product_id,
        product_type: productItem.product_type,
        sku_id: productItem.sku_id,
        quantity: productItem.quantity,
      }));

      const orderResponse = await createOrder({
        payload: orderPayload,
      });

      if (orderResponse.uuid) {
        // handle existing order case here
        cart.setCurrentOrder(orderResponse);
        setCurrentStep(CHECKOUT_STEP.SHIPPING);
      }
    }
  };

  const { upsertCustomerDetails, isUpsertingCustomerDetails } =
    useUpsertCustomerDetails();
  const onAddNewAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cart.currentOrder.uuid) return;

    await upsertCustomerDetails(
      {
        orderId: cart.currentOrder.uuid,
        payload: {
          first_name: customerData.first_name,
          last_name: customerData.last_name,
          addresses: [
            {
              address: addressData,
            },
          ],
        },
      },
      {
        onSuccess: () => {
          setCurrentStep(CHECKOUT_STEP.PAYMENT);
        },
      }
    );
  };

  const { upsertDeliveryAddress, isUpsertingDeliveryAddress } =
    useUpsertDeliveryAddress();
  const onSelectExistingAddress = async () => {
    if (!cart.currentOrder.uuid || !selectedAddress) return;
    await upsertDeliveryAddress(
      {
        orderId: cart.currentOrder.uuid,
        payload: selectedAddress,
      },
      {
        onSuccess: () => {
          setCurrentStep(CHECKOUT_STEP.PAYMENT);
        },
      }
    );
  };

  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const onPaymentSubmit = async () => {
    if (!cart.currentOrder.uuid) return;
    try {
      setIsPaymentProcessing(true);
      const response = await sdk.customer.order.initializePayment(
        cart.currentOrder.uuid
      );
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: response.getAmount(),
        currency: "INR",
        name: "444Nomizo",
        description: "Order Payment",
        order_id: response.provider_order_id,
        handler: (res: { razorpay_payment_id: string }) => {
          cart.clearCart();
          window.location.href = `/checkout/confirm?id=${res.razorpay_payment_id}`;
          // window.location.href = `/account/orders`;
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
      setIsPaymentProcessing(false);
    }
  };

  useServerCart(true, {
    revalidateOnFocus: false,
  });
  useEffect(() => {
    if (isCustomerLoggedIn()) {
      setCurrentStep(CHECKOUT_STEP.SHIPPING);

      if (cart.hasActiveCart() && cart.currentOrder.customer) {
        setCustomer(cart.currentOrder.customer.customer);
        setShippingState(
          cart.currentOrder.customer.customer.addresses?.length > 0
            ? SHIPPING_STATE.EXISTING
            : SHIPPING_STATE.NEW
        );
      }
    }
  }, [cart.currentOrder]);

  if (!cart.cartItems || !cart.cartItems?.length) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2Icon className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <div className="sticky top-0 z-10 flex h-12 w-full items-center justify-between bg-stone-800 px-6 text-xs sm:text-sm text-white">
        <Link href="/" className="font-medium uppercase cursor-default">
          444Nomizo
        </Link>
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
              {cart.cartItems.map((item) => (
                <div key={item.sku_id} className="flex gap-4">
                  <div className="size-18 rounded-md border border-stone-200 overflow-clip">
                    <Image
                      src={
                        item.product.skus[0].media[0].media_public_url ||
                        "/img/placeholder.png"
                      }
                      width={72}
                      height={72}
                      quality={25}
                      alt={item.product.name}
                      className="size-full bg-white object-cover"
                    />
                  </div>

                  <div>
                    <div className="line-clamp-2">{item.product.name}</div>
                    <div className="mt-2 flex gap-2 text-sm">
                      <span className="text-stone-500">{item.quantity} x</span>
                      <span id="selling_price">
                        {readPrice(item.selling_price, {
                          format: true,
                        })}
                      </span>
                      <span
                        id="cost_price"
                        className="font-normal text-stone-500 line-through"
                      >
                        {readPrice(item.max_retail_price, {
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
                  {cart.hasActiveCart()
                    ? readPrice(cart.currentOrder.bill?.product_total || "0", {
                        format: true,
                      })
                    : readPrice(cart.getTotal().toString(), {
                        format: true,
                      })}
                </div>
              </div>
              {cart.hasActiveCart() && (
                <>
                  {cart.currentOrder.bill?.tax_total && (
                    <div className="flex justify-between">
                      <div>Tax</div>
                      <div>
                        {readPrice(cart.currentOrder.bill?.tax_total, {
                          format: true,
                        })}
                      </div>
                    </div>
                  )}
                  {cart.currentOrder.bill?.discount_total && (
                    <div className="flex justify-between">
                      <div>Discount</div>
                      <div>
                        {readPrice(cart.currentOrder.bill?.discount_total, {
                          format: true,
                        })}
                      </div>
                    </div>
                  )}
                  {cart.currentOrder.bill?.charge_total && (
                    <div className="flex justify-between">
                      <div>Charges</div>
                      <div>
                        {readPrice(cart.currentOrder.bill.charge_total, {
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
                  {cart.currentOrder.bill?.net_total ? (
                    readPrice(cart.currentOrder.bill.net_total, {
                      format: true,
                    })
                  ) : (
                    <span className="text-stone-500 font-normal">--</span>
                  )}
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
            {currentStep === CHECKOUT_STEP.LOGIN && (
              <div data-testid="checkout__step__login" id={CHECKOUT_STEP.LOGIN}>
                <h3 className="text-xl font-medium">Login</h3>
                <div className="mt-6">
                  {!otp.otp_id ? (
                    <form
                      data-testid="checkout__form__login"
                      onSubmit={onPhoneNumberSubmit}
                    >
                      <label className="flex flex-col gap-3">
                        <Input
                          data-testid="checkout-login-form__input__phone-number"
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
                        data-testid="checkout-login-form__button__send-otp"
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
                      data-testid="checkout__form__otp"
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
                            <InputOTPGroup
                              data-testid={`checkout-otp-form__input-otp-group__${index}`}
                              key={index}
                            >
                              <InputOTPSlot
                                data-testid={`checkout-otp-form__input-otp-slot__${index}`}
                                index={index}
                              />
                            </InputOTPGroup>
                          ))}
                        </InputOTP>
                        <p className="text-xs text-stone-500">
                          Enter 6-digit OTP sent to{" "}
                          {phoneNumber || "your phone"}
                        </p>
                      </label>
                      <Button
                        type="submit"
                        loading={isOtpSubmitting || isCreatingOrder}
                        disabled={!otp.otp || otp.otp.length < 6}
                        className="mt-4"
                      >
                        Verify OTP
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            )}
            {currentStep !== CHECKOUT_STEP.LOGIN && (
              <div className="space-y-8 animate-in slide-in-from-bottom-2">
                <div
                  data-testid="checkout__step__shipping"
                  id={CHECKOUT_STEP.SHIPPING}
                  className={
                    currentStep !== CHECKOUT_STEP.SHIPPING
                      ? "opacity-60 pointer-events-none"
                      : ""
                  }
                >
                  <div className="flex gap-2 sm:flex-row flex-col justify-between mb-6">
                    <h3 className="text-xl font-medium">Shipping</h3>
                    {phoneNumber && (
                      <span className="text-xs text-stone-500">
                        Logged in with {phoneNumber}
                      </span>
                    )}
                  </div>

                  {shippingState === SHIPPING_STATE.EXISTING && (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {customer?.addresses &&
                          customer?.addresses.length > 0 &&
                          customer.addresses.map((customerAddress, index) => (
                            <label
                              data-testid={`checkout-select-shipping-address__label__${index}`}
                              key={index}
                              id={customerAddress.address.uuid}
                              onClick={() =>
                                setSelectedAddress(customerAddress.address)
                              }
                              className="has-checked:bg-brand-50/70 flex cursor-pointer items-start gap-3 rounded-md border border-stone-200 p-4 select-none"
                            >
                              <input
                                data-testid={`checkout-select-shipping-address__radio-input__${index}`}
                                type="radio"
                                name="shipping-address"
                                value={customerAddress.address.uuid}
                              />
                              <div className="space-y-1 -mt-1">
                                <div>
                                  {customerAddress.address.address_line_1}
                                </div>
                                <div>
                                  {customerAddress.address.address_line_2}
                                </div>
                                <div>{customerAddress.address.city}</div>
                                <div>{customerAddress.address.region}</div>
                                <div>{customerAddress.address.zip_code}</div>
                              </div>
                            </label>
                          ))}
                        <button
                          data-testid="checkout-select-shipping-address__button__add-new"
                          id="shipping-address__add-new"
                          className="flex cursor-pointer items-center justify-center flex-col text-stone-500 hover:text-stone-800 transition-all gap-2 rounded-md border border-stone-200 p-4 border-dashed min-h-36"
                          onClick={() => setShippingState(SHIPPING_STATE.NEW)}
                        >
                          <PlusIcon className="size-8 stroke-1" />
                          <div>Add new address</div>
                        </button>
                      </div>
                      {currentStep === CHECKOUT_STEP.SHIPPING && (
                        <Button
                          data-testid="checkout-select-shipping-address__button__continue-to-payment"
                          disabled={!selectedAddress}
                          loading={isUpsertingDeliveryAddress}
                          onClick={onSelectExistingAddress}
                          className="mt-6"
                        >
                          Continue to payment
                        </Button>
                      )}
                    </div>
                  )}
                  {shippingState === SHIPPING_STATE.NEW && (
                    <form
                      data-testid="checkout-add-shipping-address__form"
                      onSubmit={onAddNewAddress}
                      className="col-span-full"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex flex-col gap-2">
                          <Input
                            data-testid="checkout-add-shipping-address-form__input__first-name"
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
                            data-testid="checkout-add-shipping-address-form__input__last-name"
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
                            data-testid="checkout-add-shipping-address-form__input__address-line-1"
                            placeholder="Flat, House no, Building"
                            value={addressData.address_line_1}
                            onChange={(e) =>
                              setAddressData((prev: CustomerAddress) => ({
                                ...prev,
                                address_line_1: e.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="col-span-full flex flex-col gap-2">
                          <Input
                            data-testid="checkout-add-shipping-address-form__input__address-line-2"
                            placeholder="Area, Street, Sector"
                            value={addressData.address_line_2}
                            onChange={(e) =>
                              setAddressData((prev: CustomerAddress) => ({
                                ...prev,
                                address_line_2: e.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="flex flex-col gap-2">
                          <Input
                            data-testid="checkout-add-shipping-address-form__input__zip-code"
                            placeholder="Enter pincode"
                            value={addressData.zip_code}
                            maxLength={6}
                            onChange={(e) =>
                              setAddressData((prev: CustomerAddress) => ({
                                ...prev,
                                zip_code: e.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="flex flex-col gap-2">
                          <Input
                            data-testid="checkout-add-shipping-address-form__input__city"
                            placeholder="Enter city"
                            value={addressData.city}
                            onChange={(e) =>
                              setAddressData((prev: CustomerAddress) => ({
                                ...prev,
                                city: e.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="flex flex-col gap-2">
                          <Input
                            data-testid="checkout-add-shipping-address-form__input__state"
                            placeholder="Enter state"
                            value={addressData.region}
                            onChange={(e) =>
                              setAddressData((prev: CustomerAddress) => ({
                                ...prev,
                                region: e.target.value,
                              }))
                            }
                          />
                        </label>
                        <label className="flex flex-col gap-2">
                          <Input
                            data-testid="checkout-add-shipping-address-form__input__country"
                            placeholder="Enter country"
                            value={addressData.country}
                            disabled
                          />
                        </label>
                      </div>
                      {currentStep === CHECKOUT_STEP.SHIPPING && (
                        <div className="flex gap-6 justify-between mt-6 flex-col w-fit md:w-full md:flex-row">
                          <Button
                            data-testid="checkout-add-shipping-address-form__button__continue-to-payment"
                            loading={isUpsertingCustomerDetails}
                            type="submit"
                          >
                            Continue to payment
                          </Button>
                          {customer?.addresses &&
                            customer?.addresses.length > 0 && (
                              <button
                                data-testid="checkout-add-shipping-address-form__button__select-existing"
                                type="button"
                                onClick={() => {
                                  setShippingState(SHIPPING_STATE.EXISTING);
                                }}
                                className="text-stone-500 cursor-pointer text-sm h-fit hover:text-stone-800 transition-all"
                              >
                                Select from existing addresses
                              </button>
                            )}
                        </div>
                      )}
                    </form>
                  )}
                </div>

                <div
                  data-testid="checkout__step__payment"
                  id={CHECKOUT_STEP.PAYMENT}
                  className={
                    currentStep !== CHECKOUT_STEP.PAYMENT
                      ? "opacity-60 pointer-events-none"
                      : ""
                  }
                >
                  <h3 className="text-xl font-medium">Payment</h3>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                      data-testid="checkout-payment-method__label__online"
                      id="payment__online"
                      className="has-checked:bg-brand-50/70 flex cursor-pointer items-start gap-3 rounded-md border border-stone-200 p-4 select-none"
                    >
                      <input
                        data-testid="checkout-payment-method__input__online"
                        type="radio"
                        name="payment-method"
                        value="pay-online"
                        checked
                        readOnly
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
                      data-testid="checkout-payment-method__label__pay-on-delivery"
                      id="payment__pay-on-delivery"
                      className="has-checked:bg-brand-50/70 hidden _flex cursor-pointer items-start gap-3 rounded-md border border-stone-200 p-4 select-none"
                    >
                      <input
                        data-testid="checkout-payment-method__input__pay-on-delivery"
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
                  {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "x"}
                  {currentStep === CHECKOUT_STEP.PAYMENT && (
                    <Button
                      data-testid="checkout-payment-method__button__pay-now"
                      loading={isPaymentProcessing}
                      className="mt-6"
                      onClick={onPaymentSubmit}
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
