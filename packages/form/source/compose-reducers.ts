import { Reducer, Action } from 'redux';

import { Iterable } from 'immutable';

export const composeReducers =
    <State>(...reducers: Reducer<State>[]) => {
  // Pull from each reducer its initial state value, from the default
  // value of the `state' argument. So we are provided with {initialState},
  // and then with the individual initial states of each reducer. We
  // compose all these states together to produce a true 'initial state'
  // for our composed reducer.
  let state: State = null;

  for (const reducer of reducers) {
    if (Iterable.isIterable(state)) {
      state = (<any>state).concat(reducer(undefined, {type: ''}));
    }
    else {
      Object.assign(state, reducer(undefined, {type: ''}));
    }
  }

  return (s: State = state, action: Action) =>
    reducers.reduce((st, reducer) => reducer(st, action), s);
};