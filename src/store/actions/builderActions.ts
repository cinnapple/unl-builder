import { actionTypes } from "./actionTypes";

export const fetchValidators = () => ({
  type: actionTypes.FETCH_VALIDATORS
});

export const fetchValidatorsFulfilled = data => ({
  type: actionTypes.VALIDATORS_FETCHED,
  payload: data as model.IValidatorSelection[]
});
