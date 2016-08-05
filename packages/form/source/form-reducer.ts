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

import { State as StateObject } from './state';

interface Action extends ReduxAction {
  payload?;
}

const mutateState = (state, path: string[], value) => {
  if (Iterable.isIterable(state)) {
    const immutableState: Map<string, any> = <any>state; // any associative immutablejs container will do

    if (typeof immutableState.setIn !== 'function') {
      throw new FormException(`Do not know how to update Immutable state: ${path.join('.')}`);
    }

    if (path.length > 0) {
      return immutableState.setIn(path, value);
    } else {
      return immutableState.merge(value);
    }
  }
  else {
    // NOTE(cbond): In the event this proves to be as flimsy and unreliable as a Donald Trump policy proposal,
    // you may have more success with the following piece of code:
    //
    // const structure = fromJS(state);
    // return (path.length > 0
    //   ? structure.setIn(path, value)
    //   : structure.merge(value)).toJS();
    return StateObject.assign(state, path, value);
  }
};

export const defaultFormReducer = <State>(initialState?: State | Iterable.Keyed<string, any>) => {
  const reducer = <State>(state: any = initialState, action: Action) => {
    switch (action.type) {
      case FORM_CHANGED:
        const {path, value} = action.payload;

        const isImmutable = typeof state.get === 'function';

        if (path.length > 0) {
          const substate = isImmutable
            ? state.get(path[0])
            : state[path[0]];

          const mutated = mutateState(substate, path.slice(1), value);

          if (isImmutable) {
            return state.set(path[0], mutated);
          } else {
            return Object.assign({}, state, {[path[0]]: mutated});
          }
        } else {
          return mutateState(state, path, value);
        }
      default:
        return state;
    }
  }

  return reducer;
};