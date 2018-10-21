declare namespace store {
  interface RootState {
    builder: WizardState;
  }

  interface WizardState {
    validators: model.IValidatorSelection[];
    publisher: model.IPublisherInfo;
    manifestFetchResults: model.IManifestFetchResult[];
  }
}
