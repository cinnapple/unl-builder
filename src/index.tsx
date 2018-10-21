import * as React from "react";
import * as ReactDOM from "react-dom";
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import { Provider } from "react-redux";

import { fetchValidatorsEpic } from "./store/epics";
import builderReducer from "./store/reducers/builderReducer";
import StyleProvider from "./hoc/StyleProvider";
import Builder from "./containers/Builder";

let composeEnhancers = compose;
const middlewares = [];

// logger middleware
if (process.env["NODE_ENV"] === "development") {
  composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  middlewares.push(require("redux-logger").logger);
}

// Observable middleware
const rootEpic = combineEpics(fetchValidatorsEpic);
const epicMiddleware = createEpicMiddleware();
middlewares.push(epicMiddleware);

// reducers
const rootReducer = combineReducers({
  builder: builderReducer
});

// create a store
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middlewares))
);

epicMiddleware.run(rootEpic as any);

ReactDOM.render(
  <Provider store={store}>
    <StyleProvider>
      <Builder />
    </StyleProvider>
  </Provider>,
  document.querySelector("#app")
);
