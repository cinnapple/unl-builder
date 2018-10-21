import {
  deriveKeyPairs,
  encodeToBase64Hex,
  decodeFromBase64Hex,
  hexToBase58,
  base58ToHex,
  base58ToBytes,
  encodeToBase64,
  decodeBase64,
  rVerify,
  rSign,
  dateParser,
  generateSeed
} from "./helper";

import * as assert from "assert";

/**
 * Create a manifest data (Buffer object)
 * @param sequence The sequence for manifest
 * @param publicKey The manifest's public key
 * @param signingPubkey The manifest's signing publc key
 */
const getManifestForSigning = (
  sequence: number,
  publicKey: string,
  signingPubkey: string
): Buffer => {
  assert(sequence, "sequence is required");
  assert(publicKey, "publicKey is required");
  assert(signingPubkey, "signingPubkey is required");

  const sfSequence = "$";
  const sfPublicKey = "q";
  const sfSigningPubKey = "s";

  // Form manifest
  const sequenceBuf = new Buffer(4);
  (<any>sequenceBuf).writeUInt32BE(sequence);
  const sequenceBytes = sequenceBuf.toJSON().data;

  const masterPublicBytes = base58ToBytes(hexToBase58(publicKey));

  let manifestData = new Buffer("MAN\0").toJSON().data;
  manifestData = manifestData.concat(
    new Buffer(sfSequence).toJSON().data,
    sequenceBytes,
    new Buffer(sfPublicKey).toJSON().data,
    [masterPublicBytes.length],
    masterPublicBytes
  );

  if (signingPubkey) {
    const ephemeralPublicBytes = base58ToBytes(hexToBase58(signingPubkey));
    manifestData = manifestData.concat(
      new Buffer(sfSigningPubKey).toJSON().data,
      [ephemeralPublicBytes.length],
      ephemeralPublicBytes
    );
  }
  return Buffer.from(manifestData);
};

function verifyManifestSignature(
  manifest: unl.DecodedManifestPart,
  type: "masterKey" | "signingKey"
) {
  if (type === "masterKey") {
    assert(manifest.MasterSignature, "manifest's masterSignature is required");
  } else {
    assert(manifest.Signature, "manifest's signature is required");
  }

  assert(manifest.Sequence, "manifest's sequence is required");
  assert(manifest.PublicKey, "manifest's publicKey is required");
  assert(manifest.SigningPubKey, "manifest's publicKey is required");

  const hexManifest = getManifestForSigning(
    manifest.Sequence,
    manifest.PublicKey,
    manifest.SigningPubKey
  ).toString("hex");

  return rVerify(
    hexManifest,
    type === "masterKey" ? manifest.MasterSignature : manifest.Signature,
    type === "masterKey" ? manifest.PublicKey : manifest.SigningPubKey
  );
}

function verifyUnlSignature(
  blob: string,
  signature: string,
  publisherSigningPubkey: string
) {
  assert(blob, "blob is required");
  assert(signature, "signature is required");
  assert(publisherSigningPubkey, "publisherSigningPubkey is required");

  const hexValue = new Buffer(blob, "base64").toString("hex");
  return rVerify(hexValue, signature, publisherSigningPubkey);
}

/**
 * Sign the value using the hex secret.
 * @param value a Buffer or hex string value to sign
 * @param hexSecret a hex string value to sign with
 */
function sign(value: Buffer, hexSecret: string);
function sign(value: string, hexSecret: string);
function sign(value: string | Buffer, hexSecret: string) {
  assert(value, "value is required");
  assert(hexSecret, "hexSecret is required");

  if (typeof value === "string") {
    return rSign(value, hexSecret);
  }
  return rSign(value.toString("hex"), hexSecret);
}

function getBrowserTimeOffsetDate(value: Date) {
  return new Date(value.getTime() - value.getTimezoneOffset() * 60 * 1000);
}

function generateUnl(
  validators: api.Validator[],
  publisher: model.IPublisherInfo,
  manifests: api.Manifest[]
): unl.Root {
  assert(validators, "validators is required");
  assert(validators.length > 0, "validators array cannot be empty");
  assert(publisher, "publisher is required");
  assert(publisher.version, "version is required");
  assert(publisher.sequence > 0, "sequence must be greater than 0");
  assert(
    (publisher.expiration as number) > 0,
    "expiration must be greater than 0"
  );
  assert(publisher.seed, "seed is required");
  assert(publisher.signingSeed, "signingSeed is required");

  // derive keys
  const masterKeyPair = deriveKeyPairs(publisher.seed);
  publisher.secretKey = masterKeyPair.privateKey;
  publisher.publicKey = masterKeyPair.publicKey;
  const signingKeyPair = deriveKeyPairs(publisher.signingSeed);
  publisher.signingSecretKey = signingKeyPair.privateKey;
  publisher.signingPublicKey = signingKeyPair.publicKey;
  const expiration = dateParser.toSeconds(
    getBrowserTimeOffsetDate(publisher.expiration as Date)
  );

  // build blob
  const decodedBlobPart: unl.DecodedBlobPart = {
    expiration,
    sequence: publisher.sequence,
    validators: validators.map(v => {
      const manifest = manifests.find(
        m => m.master_public_key === v.validation_public_key
      );
      return {
        validation_public_key: base58ToHex(v.validation_public_key),
        manifest: encodeToBase64Hex({
          // tslint:disable-next-line:radix
          Sequence: parseInt(manifest.sequence),
          MasterSignature: manifest.master_signature,
          PublicKey: base58ToHex(manifest.master_public_key),
          SigningPubKey: base58ToHex(manifest.ephemeral_public_key),
          Signature: manifest.signature
        } as unl.DecodedManifestPart)
      };
    })
  };

  // build publisher's manifest
  const manifestData = getManifestForSigning(
    publisher.sequence,
    publisher.publicKey,
    publisher.signingPublicKey
  );
  const publisherManifest: unl.DecodedManifestPart = {
    Sequence: publisher.sequence,
    PublicKey: publisher.publicKey,
    SigningPubKey: publisher.signingPublicKey,
    MasterSignature: sign(manifestData, publisher.secretKey),
    Signature: sign(manifestData, publisher.signingSecretKey)
  };

  // create a unl
  const encodedBlob = encodeToBase64(JSON.stringify(decodedBlobPart));
  const unl: unl.Root = {
    version: publisher.version,
    public_key: publisher.publicKey,
    signature: sign(
      new Buffer(encodedBlob, "base64"),
      publisher.signingSecretKey
    ),
    manifest: encodeToBase64Hex(publisherManifest),
    blob: encodedBlob
  };

  return unl;
}

export {
  generateUnl,
  verifyManifestSignature,
  verifyUnlSignature,
  sign,
  deriveKeyPairs,
  encodeToBase64Hex,
  decodeFromBase64Hex,
  hexToBase58,
  base58ToHex,
  encodeToBase64,
  decodeBase64,
  dateParser,
  generateSeed
};
