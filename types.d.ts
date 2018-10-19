interface IResponse<TData> {
  data: TData;
  lastUpdated: string;
}

interface IValidator {
  pubkey: string;
  domain: string;
  is_ripple: boolean;
  verified: boolean;
  default: boolean;
  is_report_available: boolean;
  is_alt_net: boolean;
  agreement: number;
  disagreement: number;
  total_ledgers: number;
  city: string;
  country_name: string;
  country_code: string;
  region_name: string;
  latitude: number;
  longitude: number;
  last_datetime: string;
}
