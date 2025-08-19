import { sdk } from "../config";

export const getCustomerData = () => {
  const customerData = localStorage.getItem("customerData");
  return customerData ? JSON.parse(customerData) : null;
};

export const isCustomerLoggedIn = () => {
  return sdk.auth.login.isCustomerLoggedIn();
};
