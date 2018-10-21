import * as Yup from "yup";
export default {
  title: "Choose validators",
  validation: {
    target: "validators",
    createArraySchema: (values: store.WizardState) =>
      Yup.array().test(
        "testValidatorSelection",
        "At least one validator must be selected",
        (value: model.IValidatorSelection[]) => {
          return value.some(a => a.isSelected);
        }
      )
  }
};
