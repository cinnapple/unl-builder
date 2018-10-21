declare namespace api {
  interface ApiResponseBase {
    result: string;
    count: number;
  }

  /**
   * Ripple data api validators endpoint response
   * https://data.ripple.com/v2/network/validator_reports
   */
  interface ValidatorsResponse extends ApiResponseBase {
    reports: Validator[];
  }

  /**
   * Ripple data api manifests endpoint response
   * https://data.ripple.com/v2/network/validators/${pubkey}/manifests
   */
  interface ManifestsResponse extends ApiResponseBase {
    manifests: Manifest[];
  }

  interface Validator {
    validation_public_key: string;
    domain: string;
    domain_state: "verified" | "unverified";
    main_net_ledgers: number;
  }

  interface Manifest {
    sequence: string;
    count: number;
    first_datetime: string;
    last_datetime: string;
    master_public_key: string;
    ephemeral_public_key: string;
    master_signature: string;
    signature: string;
  }
}
