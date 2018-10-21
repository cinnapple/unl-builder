import * as Yup from "yup";

const manPopulatedForAllVals = (
  validators: model.IValidatorSelection[],
  manifestResults: model.IManifestFetchResult[]
) => {
  return validators.every(
    a =>
      !!manifestResults.find(
        m => m.pubkey === a.validation_public_key && !!m.manifest
      )
  );
};

export default {
  title: "Fetch manifests",
  validation: {
    target: "manifestFetchResults",
    createArraySchema: (values: store.WizardState) =>
      Yup.array().test(
        "consent",
        "Could not fetch manifests for one or more validator(s). Please try it again later, or consider drop the failed ones.",
        (value: model.IManifestFetchResult[]) => {
          const selected = values.validators.filter(a => a.isSelected);
          return manPopulatedForAllVals(selected, value);
        }
      )
  }
};
