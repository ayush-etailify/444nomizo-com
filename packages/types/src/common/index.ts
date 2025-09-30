/****************** function types *****************/

export type Noop = () => void;

/****************** enums *****************/

export enum Bool {
  BOOL_TRUE = "BOOL_TRUE",
  BOOL_FALSE = "BOOL_FALSE",
  BOOL_UNSPECIFIED = "BOOL_UNSPECIFIED",
}

export enum Country {
  COUNTRY_INDIA = "COUNTRY_INDIA",
}

export enum Currency {
  CURRENCY_INR = "CURRENCY_INR",
}

export enum CurrencyFormat {
  INR = "INR",
  USD = "USD",
}

export enum Gender {
  GENDER_UNSPECIFIED = "GENDER_UNSPECIFIED",
  GENDER_MALE = "GENDER_MALE",
  GENDER_FEMALE = "GENDER_FEMALE",
}

export enum IdentityType {
  IDENTITY_TYPE_UNSPECIFIED = "IDENTITY_TYPE_UNSPECIFIED",
  IDENTITY_TYPE_PHONE = "IDENTITY_TYPE_PHONE",
  IDENTITY_TYPE_EMAIL = "IDENTITY_TYPE_EMAIL",
}

/****************** types *****************/

export type PageProps = {
  params: Promise<{
    slug?: string;
  }>;
  searchParams: Promise<{
    name?: string;
    page?: string;
  }>;
};

export type Address = {
  address_line_1: string;
  address_line_2?: string;
  city: string;
  region: string;
  country: "INDIA";
  zip_code: string;
};
