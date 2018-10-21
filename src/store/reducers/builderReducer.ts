import { combineReducers } from "redux";
import { ActionType } from "typesafe-actions";

import { actionTypes } from "../actions/actionTypes";
import * as actions from "../actions";
import { DateTime } from "luxon";

const initialValidators: model.IValidatorSelection[] = [];
const initialManifests: model.IManifestFetchResult[] = [];
const initialPublisher: model.IPublisherInfo = {
  sequence: 1,
  version: 1,
  expiration: DateTime.local()
    .plus({ days: 30 })
    .startOf("day")
    .toJSDate(),
  seed: "",
  secretKey: "",
  publicKey: "",
  signingSeed: "",
  signingSecretKey: "",
  signingPublicKey: ""
};

const validatorsFetchedReducer = (
  state: model.IValidatorSelection[],
  action: ActionType<typeof actions.fetchValidatorsFulfilled>
) => {
  return action.payload;
};

export default combineReducers<store.WizardState, any>({
  validators: (state = initialValidators, action) => {
    switch (action.type) {
      case actionTypes.VALIDATORS_FETCHED:
        return validatorsFetchedReducer(state, action);
      default:
        return state;
    }
  },
  publisher: (state = initialPublisher) => state,
  manifestFetchResults: (state = initialManifests) => state
});
