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

export enum MediaType {
  MEDIA_TYPE_IMAGE = "MEDIA_TYPE_IMAGE",
  MEDIA_TYPE_VIDEO = "MEDIA_TYPE_VIDEO",
  MEDIA_TYPE_AUDIO = "MEDIA_TYPE_AUDIO",
  MEDIA_TYPE_DOCUMENT = "MEDIA_TYPE_DOCUMENT",
}

export enum MimeType {
  MIME_TYPE_INVALID = "MIME_TYPE_INVALID",
  MIME_TYPE_PDF = "MIME_TYPE_PDF",
  MIME_TYPE_JPEG = "MIME_TYPE_JPEG",
  MIME_TYPE_PNG = "MIME_TYPE_PNG",
  MIME_TYPE_MP4 = "MIME_TYPE_MP4",
  MIME_TYPE_SVG = "MIME_TYPE_SVG",
  MIME_TYPE_MP3 = "MIME_TYPE_MP3",
  MIME_TYPE_WAV = "MIME_TYPE_WAV",
  MIME_TYPE_DOCX = "MIME_TYPE_DOCX",
}

export type Media = {
  media_type: MediaType;
  mime_type: MimeType;
  media_name: string;
  media_public_url?: string;
};

export type PageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    name?: string;
  }>;
};

export type SearchParams = {
  page?: number;
  size?: number;
  searchTerm?: string;
};

export type SearchResponse<T> = {
  response: T[];
  page_response: {
    total?: string;
    has_next_page?: boolean;
  };
};
