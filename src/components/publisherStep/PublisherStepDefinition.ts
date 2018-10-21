import * as Yup from "yup";
import { deriveKeyPairs } from "../../lib/unl-builder";

const canDeriveKeyPairs = (seed: string) => {
  try {
    const pair = deriveKeyPairs(seed);
    return !!pair.privateKey && !!pair.publicKey;
  } catch {}
  return false;
};

export default {
  title: "Enter publisher info",
  validation: {
    target: "publisher",
    createObjectSchema: (values: store.WizardState) =>
      Yup.object().shape({
        sequence: Yup.number()
          .typeError("Sequence must be a positive integer value")
          .integer("Sequence must be a positive integer value")
          .notOneOf([0], "Sequence must be a positive integer value")
          .positive("Sequence must be a positive integer value")
          .required("Sequence is required"),
        version: Yup.number()
          .typeError("Version must be a positive integer value")
          .integer("Version must be a positive integer value")
          .notOneOf([0], "Sequence must be a positive integer value")
          .positive("Version must be a positive integer value")
          .required("Version is required"),
        expiration: Yup.date().required("Expiration Date is required"),
        seed: Yup.string()
          .required("Master Seed is required")
          .test(
            "testSeedValidity",
            "Could not derive a key pair from the given seed",
            (value: string) => canDeriveKeyPairs(value)
          ),
        signingSeed: Yup.string()
          .required("Signing Seed is required")
          .test(
            "testSeedValidity",
            "Could not derive a key pair from the given seed",
            (value: string) => canDeriveKeyPairs(value)
          )
      })
  }
};
