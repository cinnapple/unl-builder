import {
  verifyUnlSignature,
  verifyManifestSignature,
  sign,
  deriveKeyPairs,
  encodeToBase64Hex,
  decodeFromBase64Hex,
  hexToBase58,
  base58ToHex,
  encodeToBase64,
  decodeBase64,
  dateParser,
  generateUnl
} from "../../src/lib/unl-builder";
import { fixtures } from "../../__data__/fixtures";

test("hexToBase58", () => {
  const result = hexToBase58(fixtures.keys.keypair.publicKeyHex);
  expect(result).toEqual(fixtures.keys.keypair.publicKey);
});

test("base58ToHex", () => {
  const result = base58ToHex(fixtures.keys.keypair.publicKey);
  expect(result).toEqual(fixtures.keys.keypair.publicKeyHex);
});

test("decodeBase64", () => {
  const result = JSON.parse(decodeBase64(fixtures.smallBlob.blob));
  expect(result).toEqual(fixtures.smallBlob.decodedBlob);
});

test("encodeToBase64", () => {
  const result = encodeToBase64(JSON.stringify(fixtures.smallBlob.decodedBlob));
  expect(result).toEqual(fixtures.smallBlob.blob);
});

test("decodeFromBase64Hex", () => {
  const result = decodeFromBase64Hex(fixtures.unl.manifest);
  expect(result).toEqual(fixtures.decodedManifest);
});

test("encodeToBase64Hex", () => {
  const result = encodeToBase64Hex(fixtures.decodedManifest);
  expect(result).toEqual(fixtures.unl.manifest);
});

test("publisher's manifest's public key is the same as the unl's public key", () => {
  const result = decodeFromBase64Hex(fixtures.unl.manifest);
  expect(hexToBase58(result.PublicKey)).toEqual(fixtures.publisher.publicKey);
  expect(hexToBase58(result.SigningPubKey)).toEqual(
    fixtures.publisher.signingPubKey
  );
});

test("verifyManifestSignature - signingKey", () => {
  expect(
    verifyManifestSignature(
      decodeFromBase64Hex(fixtures.unl.manifest),
      "signingKey"
    )
  ).toBeTruthy();
});

test("verifyManifestSignature - masterKey", () => {
  expect(
    verifyManifestSignature(
      decodeFromBase64Hex(fixtures.unl.manifest),
      "masterKey"
    )
  ).toBeTruthy();
});

test("verifyUnlSignature", () => {
  expect(
    verifyUnlSignature(
      fixtures.unl.blob,
      fixtures.unl.signature,
      fixtures.decodedManifest.SigningPubKey
    )
  ).toBeTruthy();
});

test("sign - manifest", () => {
  const signature = sign(
    new Buffer(fixtures.unl.manifest, "base64"),
    fixtures.keys.keypair.privateKey
  );
  expect(
    verifyUnlSignature(
      fixtures.unl.manifest,
      signature,
      fixtures.keys.keypair.publicKeyHex
    )
  ).toBeTruthy();
});

test("sign - blob", () => {
  const signature = sign(
    new Buffer(fixtures.unl.blob, "base64"),
    fixtures.keys.keypair.privateKey
  );
  expect(
    verifyUnlSignature(
      fixtures.unl.blob,
      signature,
      fixtures.keys.keypair.publicKeyHex
    )
  ).toBeTruthy();
});

test("deriveKeyPairs", () => {
  const pair = deriveKeyPairs(fixtures.keys.seed);
  expect(pair).toEqual({
    privateKey: fixtures.keys.keypair.privateKey,
    publicKey: fixtures.keys.keypair.publicKeyHex
  });
});

describe("dateParser", () => {
  const date = new Date(2018, 0, 1, 0, 0, 0, 0);
  const numericDate = 568108800;
  test("toSeconds", () => {
    expect(dateParser.toSeconds(date)).toEqual(numericDate);
  });
  test("toDate", () => {
    expect(dateParser.toDate(numericDate)).toEqual(date);
  });
});

describe("generateUnl", () => {
  const validators = [
    {
      validation_public_key:
        "nHDadStTnSfQ55fVwjJP7HdGHXp5J9P33KftxeZNLVfoPHMLKHM2",
      date: "2018-11-06T00:00:00Z",
      total_ledgers: 6446,
      main_net_agreement: "0.99876",
      main_net_ledgers: 6443,
      alt_net_agreement: "0.00000",
      alt_net_ledgers: 0,
      other_ledgers: 3,
      domain: "tripsite.com",
      domain_state: "verified",
      last_datetime: "2018-11-06T06:28:37.190Z",
      isSelected: true
    }
  ];
  const publisher = {
    sequence: 1,
    version: 1,
    expiration: new Date(2018, 11, 5),
    seed: "sEd7L8W3keE89jDsHbSVwL728y3ELrK",
    secretKey: "",
    publicKey: "",
    signingSeed: "sEd7hYC2KwTwzBgwTgQz3hWPzDGznBW",
    signingSecretKey: "",
    signingPublicKey: ""
  };
  const manifests = [
    {
      count: 132,
      ephemeral_public_key:
        "n94we296rowahLd5hPEjRGddTcXYYZPhwtLtvHtYa8vkCexePm9p",
      first_datetime: "2018-06-10T07:22:22.169Z",
      last_datetime: "2018-11-01T09:56:07.208Z",
      master_public_key: "nHDadStTnSfQ55fVwjJP7HdGHXp5J9P33KftxeZNLVfoPHMLKHM2",
      master_signature:
        "919ED55822072EC0EEF21B538974BAAA52032B1605D715E7EC47840DAAFE9F4C34A6A0EE49809903B5291D46117FEA2380FBAB5F9151F0DC42656FC8D3085C0A",
      sequence: "1",
      signature:
        "3044022042F26D1E3245F936012CC300D778CF733396355E0776CFF9F500C8CA4F75893F022061B9BB95D5A2393C8630390994C81E09F012C88664FAF3281CA5CCD0C64504BE"
    }
  ];

  test("success", () => {
    const unl = generateUnl(validators, publisher, manifests);

    // check signature
    expect(
      verifyUnlSignature(unl.blob, unl.signature, publisher.signingPublicKey)
    ).toBeTruthy();
  });
});
