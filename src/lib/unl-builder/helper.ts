import { decode as decodeBase64, encode as encodeToBase64 } from "base-64";
import {
  decode as decodeBase64Hex,
  encode as encodeBase64Hex
} from "ripple-binary-codec";
import { encodeNodePublic, decodeNodePublic } from "ripple-address-codec";
import {
  verify as rVerify,
  sign as rSign,
  deriveKeypair,
  generateSeed as _generateSeed
} from "ripple-keypairs";

const RIPPLE_EPOCH = 946684800;

const generateSeed = () => {
  return _generateSeed({ algorithm: "ed25519" });
};

const decodeFromBase64Hex = (value: string) => {
  const buff = new Buffer(value, "base64");
  const hex = buff.toString("hex").toUpperCase();
  return decodeBase64Hex(hex);
};

const encodeToBase64Hex = (value: any) => {
  const hex = encodeBase64Hex(value);
  const buff = new Buffer(hex, "hex");
  return buff.toString("base64");
};

const hexToBase58 = (hex: string) => encodeNodePublic(new Buffer(hex, "hex"));

const base58ToBytes = (value: string) => decodeNodePublic(value);

const base58ToHex = (value: string) =>
  new Buffer(base58ToBytes(value)).toString("hex").toUpperCase();

function deriveKeyPairs(seed: string) {
  return deriveKeypair(seed);
}

const dateParser = {
  toDate: (value: number) => {
    return new Date((value + RIPPLE_EPOCH) * 1000);
  },
  toSeconds: (value: Date) => {
    return value.getTime() / 1000 - RIPPLE_EPOCH;
  }
};

export {
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
};
