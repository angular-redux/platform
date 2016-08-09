import {
  Iterable,
  Map,
  fromJS
} from 'immutable';

import { Reducer } from 'redux';

import { FormException } from './form-exception';

import {
  FORM_CHANGED,
  FormStore,
} from './form-store';

import { State } from './state';

export const defaultFormReducer = <RootState>(initialState?: RootState | Iterable.Keyed<string, any>) => {
  const reducer = (state: RootState | Iterable.Keyed<string, any> = initialState, action: Redux.Action & {payload?}) => {
    switch (action.type) {
      case FORM_CHANGED:
        return State.assign(
          state,
          action.payload.path,
          action.payload.value);
      default:
        return state;
    }
  }

  return reducer;
};