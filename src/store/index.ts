import throttle from "lodash/throttle";
import { createStore } from "redux";
import { loadState } from "./local-storage";
import persistState from "./persist-state";
import { Action, StateRedux } from "./type-redux";

const INITIAL_STATE: StateRedux = {
  filtro: {
    manufacturersFilter: null,
  },
  manufacturers: null,
  session: null,
  usuario: null,
  manufacturer: null,
};

const userRedux = (
  state: StateRedux = INITIAL_STATE,
  action: Action,
): StateRedux => {
  switch (action.type) {
    case "FILTER_MANUFACTURER":
      return {
        ...state,
        filtro: {
          ...state.filtro,
          manufacturersFilter: action.manufacturersFilter,
        },
      };

    case "MANUFACTURER":
      return {
        ...state,
        manufacturers: action.manufacturers,
      };
    case "SESSION":
      return {
        ...state,
        session: action.session,
      };

    case "USER":
      return {
        ...state,
        usuario: action.usuario,
      };
    default:
      return state;
  }
};

const persistedState = loadState();

const store = persistedState
  ? createStore(userRedux, persistedState)
  : createStore(userRedux);

store.subscribe(throttle(persistState(store), 1000));

export default store;
