import {Reducer, Action} from 'redux';

export const composeReducers =
  <State>(...reducers: Reducer<State>[]): Reducer<State> => 
    (s: State, action: Action) =>
      reducers.reduce((st, reducer) => reducer(st, action), s);
