import { expect } from 'chai';

import {
  List,
  Map,
  OrderedSet,
  Set
} from 'immutable';

import { composeReducers } from './compose-reducers';

describe('composeReducers', () => {
  it('can compose multiple plain-object reducers and initial states', () => {
    const r1 = (state = {a: 1}, action) => state;
    const r2 = (state = {b: 1}, action) => state;

    const reducer = composeReducers<any>({c: 1}, r1, r2);

    const composedState = reducer(undefined, {type: ''});

    expect(composedState).not.to.be.undefined;
    expect(composedState.a).to.eq(1)
    expect(composedState.b).to.eq(1);
    expect(composedState.c).to.eq(1);
  });


});
