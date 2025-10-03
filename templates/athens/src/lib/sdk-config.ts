import EtailifyStorefrontSDK from "@etailify/storefront-sdk";

export const sdk = new EtailifyStorefrontSDK({
  baseUrl:
    "https://nonadept-unquixotical-chelsie.ngrok-free.dev/customer_gateway_svc",
  storeSlug: process.env.STORE_SLUG! || process.env.NEXT_PUBLIC_STORE_SLUG!,
  storeId: process.env.STORE_ID! || process.env.NEXT_PUBLIC_STORE_ID!,
  isDevelopment: process.env.NODE_ENV === "development",
});
