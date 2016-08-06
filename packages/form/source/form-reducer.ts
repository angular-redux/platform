import {
  Iterable,
  Map,
  fromJS
} from 'immutable';

import {
  Action as ReduxAction,
  Reducer
} from 'redux';

import { FormException } from './form-exception';

import {
  FORM_CHANGED,
  FormStore,
} from './form-store';

import { State } from './state';

interface Action extends ReduxAction {
  payload?;
}

export const defaultFormReducer = <RootState>(initialState?: RootState | Iterable.Keyed<string, any>) => {
  const reducer = (state: RootState | Iterable.Keyed<string, any> = initialState, action: Action) => {
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

const immutableToString = collection => {
  if (Iterable.isAssociative(collection)) {
    return 'associative container';
  }
  else if (Iterable.isIndexed(collection)) {
    return 'indexed collection';
  }
  else if (Iterable.isKeyed(collection)) {
    return 'keyed collection';
  }
  else if (Iterable.isOrdered(collection)) {
    return 'ordered set';
  }
  else {
    return '<unknown type>';
  }
};