import { StateRedux } from "./type-redux";

const STATE_REDUX = "@[REDUX-PAD-SALES-MAIN]";

export const loadState = (): StateRedux | null => {
  const serializedState = localStorage.getItem(STATE_REDUX);
  if (!serializedState) {
    return null;
  }

  return JSON.parse(serializedState) || null;
};

export const saveState = (state: StateRedux): void => {
  const serializedState = JSON.stringify(state);
  localStorage.setItem(STATE_REDUX, serializedState);
};

export const deleteState = (): void => {
  localStorage.removeItem(STATE_REDUX);
};
