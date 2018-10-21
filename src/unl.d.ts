declare namespace unl {
  interface Root {
    /**
     * The version of this UNL
     */
    version: number;
    /**
     * Publisher's public key
     */
    public_key: string;
    /**
     * The signature signed by the publisher's signing key.
     */
    signature: string;
    /**
     * The publisher's encoded manifest
     */
    manifest: string | DecodedManifestPart;
    /**
     * The list of validator encoded in base64
     */
    blob: string | DecodedBlobPart;
  }

  interface DecodedBlobPart {
    sequence: number;
    expiration: number;
    validators: ValidatorPart[];
  }

  interface ValidatorPart {
    validation_public_key: string;
    manifest: string | DecodedManifestPart;
  }

  interface DecodedManifestPart {
    Sequence: number;
    MasterSignature: string;
    PublicKey: string;
    SigningPubKey: string;
    Signature: string;
  }
}
