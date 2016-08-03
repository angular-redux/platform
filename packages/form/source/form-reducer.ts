import {
  Iterable,
  Map,
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

const mutateState = (state, path: string[], value) => {
  if (Iterable.isIterable(state)) {
    const immutableState: Map<string, any> = <any>state; // any associative immutablejs container will do

    if (typeof immutableState.setIn !== 'function') {
      throw new Error(`Do not know how to update Immutable state: ${path.join('.')}`);
    }

    if (path.length > 0) {
      return immutableState.setIn(path, value);
    } else {
      return immutableState.merge(value);
    }
  }
  else {
    // NOTE(cbond): The performance of this is not optimal, but the terse syntax
    // is wonderful. We essentially need a setIn() implementation for plain JS
    // objects but, absent that, ImmutableJS works well. This also works with Map,
    // Set, and Array types. Our own implementation that allows for all these
    // variations is not likely to be as robust as this. So the performance trade-
    // off is worth it. Even for large state objects, I don't think this will
    // introduce much latency.
    let structure = fromJS(state);

    if (path.length > 0) {
      structure = structure.setIn(path, value);
    } else {
      structure = structure.merge(value);
    }

    return structure.toJS();
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