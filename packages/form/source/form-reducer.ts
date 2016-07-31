import { Iterable } from 'immutable';

import { Action as ReduxAction, Reducer } from 'redux';

import { FormActions } from './form-actions';

interface Action extends ReduxAction {
  payload?;
}

const updateImmutable = <State>(state: State | Iterable<string, any>, action: Action) => {
  return state;
}

const updateObject = <State>(state: State, action: Action) => {
  return state;
}

export const formReducer = <State>(state: State | Iterable<string, any>, action: Action) => {
  switch (action.type) {
    case FormActions.FORM_VALUE_CHANGED:
      if (Iterable.isIterable(state)) {
        return updateImmutable(<any> state, action);
      }
      else {
        return updateObject(state, action);
      }
    default:
      return state;
  }
};