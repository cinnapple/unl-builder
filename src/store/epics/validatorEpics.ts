import { Observable } from "rxjs";
import { map, mergeMap, delay } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { Action } from "redux";
import { ofType, StateObservable } from "redux-observable";

import { actionTypes } from "../actions/actionTypes";
import { fetchValidatorsFulfilled } from "../actions";

const sortValidators = (validators: model.IValidatorSelection[]) => {
  validators.sort((v1, v2) => {
    if (v1.domain > v2.domain) {
      return 1;
    }
    if (v1.domain < v2.domain) {
      return -1;
    }
    return 0;
  });
  return validators;
};

const fetchValidatorsEpic = (
  action$: Observable<Action>,
  state$: StateObservable<store.RootState>
) =>
  action$.pipe(
    ofType(actionTypes.FETCH_VALIDATORS),
    mergeMap(action =>
      ajax
        .getJSON<{ reports: model.IValidatorSelection[] }>(
          `https://data.ripple.com/v2/network/validator_reports`
        )
        .pipe(
          map(response =>
            fetchValidatorsFulfilled(
              sortValidators(
                // get only the verified validators
                response.reports.filter(
                  a =>
                    a.domain &&
                    a.domain_state === "verified" &&
                    a.main_net_ledgers > 0
                )
              )
            )
          ),
          delay(1500)
        )
    )
  );

export { fetchValidatorsEpic };
