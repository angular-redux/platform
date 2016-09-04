import {Reducer, Action} from 'redux';

import {Iterable} from 'immutable';

import {FormException} from './form-exception';
import {State} from './state';

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

    if (state == null) {
      state = result;
    }
    else {
      state = State.inspect(state).merge(null, result);
    }
  }

  return (s: State = state, action: Action) =>
    reducers.reduce((st, reducer) => reducer(st, action), s);
};