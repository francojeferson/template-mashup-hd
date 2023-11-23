import { StateRedux } from "./type-redux";

const getPersistedState = (state: StateRedux) => ({
  ...state,
});

export default getPersistedState;
