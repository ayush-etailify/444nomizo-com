import { Customer, IdentityType } from "@etailify/types";
import { sdk } from "../sdk-config";

export const isCustomerLoggedIn = () => {
  return sdk.auth.login.isCustomerLoggedIn();
};

export const getCustomerData = (): Customer | null => {
  const customerDataString = localStorage.getItem("customerData");
  if (!customerDataString) return null;

  return JSON.parse(customerDataString) as Customer;
};

export const getIdentityValue = (
  customer: Customer,
  identityType: IdentityType
): string | undefined => {
  if (!customer.identities || customer.identities.length === 0)
    return undefined;

  return customer.identities.find((i) => i.identity_type === identityType)
    ?.identity_value;
};
