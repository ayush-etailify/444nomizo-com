import { CurrencyFormat } from "@etailify/types";

export const readPrice = (
  price: string,
  options?: {
    denominator?: number;
    format?: boolean;
    numberFormatOptions?: {
      locale: "en-IN" | "en-US";
      style: "currency" | "decimal";
      currency: CurrencyFormat;
    };
  }
) => {
  if (!price) return "";

  const {
    denominator = 100,
    format = false,
    numberFormatOptions,
  } = options || {};
  const priceValue = Number(price);
  const normalizedPrice = priceValue / denominator;

  if (isNaN(normalizedPrice)) return "";

  if (format) {
    const {
      locale = "en-IN",
      style = "currency",
      currency = CurrencyFormat.INR,
      ...formatOptions
    } = numberFormatOptions || {};
    return new Intl.NumberFormat(locale, {
      style,
      currency,
      ...formatOptions,
    }).format(normalizedPrice);
  }

  return normalizedPrice.toString();
};
