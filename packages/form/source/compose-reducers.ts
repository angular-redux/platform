import { Reducer, Action } from 'redux';

import { Iterable } from 'immutable';

import { FormException } from './form-exception';

export const composeReducers =
    <State>(...reducers: Reducer<State>[]): Reducer<State> => {
  // Pull from each reducer its initial state value, from the default
  // value of the `state' argument. So we are provided with {initialState},
  // and then with the individual initial states of each reducer. We
  // compose all these states together to produce a true 'initial state'
  // for our composed reducer.
  let state: State = null;

  for (const reducer of reducers) {
    const result = reducer.apply(null, [undefined, {type: ''}]);
    if (result === undefined) {
      continue;
    }

    if (Iterable.isIterable(state)) {
      state = (<any>state).concat(result);
    }
    else {
      if (result instanceof Array) {
        if (state instanceof Array) {
          state = (<any>state).concat(result);
        } else if (state == null) {
          state = result;
        } else {
          throw new FormException('Cannot combine an array with a non-array');
        }
      }
      else if (state instanceof Map) {
        const m: Map<string, any> = state as any;
        for (const e of m.entries()) {
          m.set(e[0], e[1]);
        }
      } else if (state) {
        if (state instanceof Array) {
          throw new Error('Cannot combine array with non-array');
        }
        Object.assign(state, result);
      }
      else {
        state = result;
      }
    }
  }

  return (s: State = state, action: Action) =>
    reducers.reduce((st, reducer) => reducer(st, action), s);
};