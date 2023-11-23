import { Store } from "redux";
import getPersistedState from "./get-persisted-state";
import { saveState } from "./local-storage";
import { Action, StateRedux } from "./type-redux";

export type AppStore = Store<StateRedux, Action>;

const persistState = (store: AppStore) => (): void =>
  saveState(getPersistedState(store.getState()));

export default persistState;
