import { Reducer, AnyAction } from 'redux';

export const composeReducers = <State>(
  ...reducers: Reducer<State, AnyAction>[]
): Reducer<State, AnyAction> => (s: any, action: AnyAction) =>
  reducers.reduce((st, reducer) => reducer(st, action), s);
