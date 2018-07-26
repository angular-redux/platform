import { fromJS, List, Map, Set } from 'immutable';

import { composeReducers } from './compose-reducers';

xdescribe('composeReducers', () => {
  const compose = (s1: any, s2: any, s3: any) => {
    const r1 = (state = s1) => state;
    const r2 = (state = s2) => state;
    const r3 = (state = s3) => state;

    const reducer = composeReducers(r1, r2, r3);

    return reducer(undefined, { type: '' });
  };

  it('can compose plain-object initial states', () => {
    const state = compose(
      { a: 1 },
      { b: 1 },
      { c: 1 },
    );
    expect(state).toBeDefined();
    expect(state).toEqual({ a: 1, b: 1, c: 1 });
  });

  it('can compose array states', () => {
    const state = compose(
      [1],
      [2],
      [3],
    );
    expect(state).toBeDefined();
    expect(state).toEqual([1, 2, 3]);
  });

  it('can compose Immutable::Map initial states', () => {
    const state = compose(
      fromJS({ a: 1 }),
      fromJS({ b: 1 }),
      fromJS({ c: 1 }),
    );
    expect(Map.isMap(state)).toEqual(true);

    const plain = state.toJS();
    expect(plain).not.toBeNull();
    expect(plain).toEqual({ a: 1, b: 1, c: 1 });
  });

  it('can compose Immutable::Set initial states', () => {
    const state = compose(
      Set.of(1, 2, 3),
      Set.of(4, 5, 6),
      Set.of(),
    );
    expect(Set.isSet(state)).toEqual(true);

    const plain = state.toJS();
    expect(plain).not.toBeNull();
    expect(plain).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('can compose Immutable::OrderedSet initial states', () => {
    const state = compose(
      Set.of(3, 2, 1),
      Set.of(4, 6, 5),
      Set.of(),
    );
    expect(Set.isSet(state)).toEqual(true);

    const plain = state.toJS();
    expect(plain).not.toBeNull();
    expect(plain).toEqual([3, 2, 1, 4, 6, 5]);
  });

  it('can compose Immutable::List initial states', () => {
    const state = compose(
      List.of('a', 'b'),
      List.of('c', 'd'),
      List.of(),
    );
    expect(List.isList(state)).toEqual(true);

    const plain = state.toJS();
    expect(plain).not.toBeNull();
    expect(plain).toEqual(['a', 'b', 'c', 'd']);
  });
});
