import { Reducer, Action } from 'redux';

import { Iterable } from 'immutable';

export const composeReducers =
    <State>(initialState: State, ...reducers: Reducer<State>[]) => {
  // Pull from each reducer its initial state value, from the default
  // value of the `state' argument. So we are provided with {initialState},
  // and then with the individual initial states of each reducer. We
  // compose all these states together to produce a true 'initial state'
  // for our composed reducer.
  let state: State;

  if (Iterable) {
    if (Iterable.isIterable(initialState)) {
      state = composeImmutable(<any> initialState, reducers) as any;
    }
  }

  if (state == null) {
    state = compose(initialState, reducers);
  }

  return (s: State = state, action: Action) =>
    reducers.reduce((st, reducer) => reducer(st, action), s);
};

function composeImmutable(state, reducers: Reducer<any>[]) {
  return reducers.reduce(
    (s, reducer) => s.concat(reducer(undefined, {type: ''})),
    state);
}

function compose<State>(state: State, reducers: Reducer<State>[]) {
  return reducers.reduce(
    (s, reducer) => Object.assign(s, reducer(undefined, {type: ''})),
    state);
}