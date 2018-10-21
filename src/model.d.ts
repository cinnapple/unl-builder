declare namespace model {
  interface IPublisherInfo {
    /**
     * The sequence of the validator list.
     * Increment by 1 every time it is renewed.
     */
    sequence: number;
    /**
     * The version of a UNL.
     * e.g. 1
     */
    version: number;
    /**
     * The expiring date for the UNL
     */
    expiration: number | Date;
    /**
     * Publisher's master key seed for generating a key pair for signing a manifest
     */
    seed: string;
    /**
     * Publisher's master secret
     */
    secretKey: string;
    /**
     * Publisher's public key for identifying the publisher
     */
    publicKey: string;
    /**
     * Signing seed for generating a key pair for signing a UNL
     */
    signingSeed: string;
    /**
     * Signing secret for signing a UNL
     */
    signingSecretKey: string;
    /**
     * Signing public key for verifying the signature of a UNL
     */
    signingPublicKey: string;
  }

  interface IValidatorSelection extends api.Validator {
    isSelected: boolean;
    isLoadingManifest: boolean;
  }

  interface IManifestFetchResult {
    pubkey: string;
    error?: string;
    manifest: api.Manifest;
  }
}
