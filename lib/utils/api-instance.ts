import axios from "axios";

export const createServerAPIInstance = (baseURL: string) => {
  const apiInstance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return apiInstance;
};

export const createClientAPIInstance = (baseURL: string) => {
  const apiInstance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add request interceptor to include access token in headers
  apiInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) config.headers.Authorization = accessToken;
    return config;
  });

  return apiInstance;
};

export const storefrontServerAPI = createServerAPIInstance(
  process.env.STOREFRONT_BASE_API_URL || ""
);

export const storefrontClientAPI = createClientAPIInstance(
  process.env.NEXT_PUBLIC_STOREFRONT_BASE_API_URL || ""
);
