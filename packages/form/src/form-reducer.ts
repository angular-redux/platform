import { Iterable } from 'immutable';

import { Action } from 'redux';

import { FORM_CHANGED } from './form-store';

import { State } from './state';

export const defaultFormReducer = <RootState>(
  initialState?: RootState | Iterable.Keyed<string, any>,
) => {
  const reducer = (
    state: RootState | Iterable.Keyed<string, any> | undefined = initialState,
    action: Action & { payload?: any },
  ) => {
    switch (action.type) {
      case FORM_CHANGED:
        return State.assign(state, action.payload.path, action.payload.value);
      default:
        return state;
    }
  };

  return reducer;
};
