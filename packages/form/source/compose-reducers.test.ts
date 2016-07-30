import { expect } from 'chai';

import {
  fromJS,
  List,
  Map,
  OrderedSet,
  Set
} from 'immutable';

import { composeReducers } from './compose-reducers';

describe('composeReducers', () => {
  const compose = (s1, s2, s3) => {
    const r1 = (state = s1, action) => state;
    const r2 = (state = s2, action) => state;

    const reducer = composeReducers<any>(s3, r1, r2);

    return reducer(undefined, {type: ''});
  }
  it('can compose plain-object initial states', () => {
    const state = compose({a: 1}, {b: 1}, {c: 1});
    expect(state).not.to.be.undefined;
    expect(state).to.deep.equal({a: 1, b: 1, c: 1});
  });

  it('can compose Immutable::Map initial states', () => {
    const state = compose(fromJS({a: 1}), fromJS({b: 1}), fromJS({c: 1}));
    expect(Map.isMap(state)).to.be.true;

    const plain = state.toJS();
    expect(plain).not.to.be.null;
    expect(plain).to.deep.equal({a: 1, b: 1, c: 1});
  });

  it('can compose Immutable::Set initial states', () => {
    const state = compose(Set.of(1, 2, 3), Set.of(4, 5, 6), Set.of());
    expect(Set.isSet(state)).to.be.true;

    const plain = state.toJS();
    expect(plain).not.to.be.null;
    expect(plain).to.deep.equal([1, 2, 3, 4, 5, 6]);
  });

  it('can compose Immutable::OrderedSet initial states', () => {
    const state = compose(Set.of(3, 2, 1), Set.of(4, 6, 5), Set.of());
    expect(Set.isSet(state)).to.be.true;

    const plain = state.toJS();
    expect(plain).not.to.be.null;
    expect(plain).to.deep.equal([3, 2, 1, 4, 6, 5]);
  });

  it('can compose Immutable::List initial states', () => {
    const state = compose(List.of('a', 'b'), List.of('c', 'd'), List.of());
    expect(List.isList(state)).to.be.true;

    const plain = state.toJS();
    expect(plain).not.to.be.null;
    expect(plain).to.deep.equal(['a', 'b', 'c', 'd']);
  });

  it('throws an exception when given a null initial state', () => {
    expect(() => {
      const state = compose(List.of(), List.of(), null);
    }).to.throw();
  });
});
