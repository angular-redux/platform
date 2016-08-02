import {
  Iterable,
  fromJS
} from 'immutable';

import {
  Action as ReduxAction,
  Reducer
} from 'redux';

import {
  FORM_CHANGED,
  FormStore,
} from './form-store';

interface Action extends ReduxAction {
  payload?;
}

interface FormValueChanged {
  /// Path to the key being changed
  path: string[];

  /// Is the form in a valid state (all validators passing)?
  valid: boolean;

  value;
}

const updateImmutable = <State>(state, change: FormValueChanged) => {
  const {path, value} = change;

  if (typeof state.setIn !== 'function') {
    throw new Error(`Do not know how to update Immutable state: ${path.join('.')}`);
  }
  return state.setIn(path, value);
}

const updateObject = <State>(state: State, change: FormValueChanged) => {
  const {path, value} = change;

  return fromJS(state).setIn(path, value).toJS();
}

export const formReducer = <State>(state: State | Iterable.Keyed<string, any>, action: Action) => {
  switch (action.type) {
    case FORM_CHANGED:
      if (Iterable && Iterable.isIterable(state)) {
        return updateImmutable(<any> state, action.payload);
      }
      else {
        return updateObject(state, action.payload);
      }
    default:
      return state;
  }
};