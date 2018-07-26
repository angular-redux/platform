// TODO: See if this linting rule can be enabled with new build process (ng-packagr)
// tslint:disable:no-implicit-dependencies
// tslint:disable:member-ordering
import {
  Comparator,
  NgRedux,
  PathSelector,
  Selector,
} from '@angular-redux/store';
import {
  AnyAction,
  Dispatch,
  Middleware,
  Reducer,
  Store,
  StoreEnhancer,
} from 'redux';
import { Observable, Subject } from 'rxjs';
import { MockObservableStore } from './observable-store.mock';
/**
 * Convenience mock to make it easier to control selector
 * behaviour in unit tests.
 */
export class MockNgRedux<T = {}> extends NgRedux<T> {
  /** @deprecated Use MockNgRedux.getInstance() instead. */
  static mockInstance?: MockNgRedux<any> = undefined;

  /**
   * Returns a subject that's connected to any observable returned by the
   * given selector. You can use this subject to pump values into your
   * components or services under test; when they call .select or @select
   * in the context of a unit test, MockNgRedux will give them the values
   * you pushed onto your stub.
   */
  static getSelectorStub<R, S>(
    selector?: Selector<R, S>,
    comparator?: Comparator,
  ): Subject<S> {
    return MockNgRedux.getInstance().mockRootStore.getSelectorStub<S>(
      selector,
      comparator,
    );
  }

  /**
   * Returns a mock substore that allows you to set up selectorStubs for
   * any 'fractal' stores your app creates with NgRedux.configureSubStore.
   *
   * If your app creates deeply nested substores from other substores,
   * pass the chain of pathSelectors in as ordered arguments to mock
   * the nested substores out.
   * @param pathSelectors
   */
  static getSubStore<S>(
    ...pathSelectors: PathSelector[]
  ): MockObservableStore<S> {
    return pathSelectors.length
      ? MockNgRedux.getInstance().mockRootStore.getSubStore(...pathSelectors)
      : MockNgRedux.getInstance().mockRootStore;
  }

  /**
   * Reset all previously configured stubs.
   */
  static reset(): void {
    MockNgRedux.getInstance().mockRootStore.reset();
    NgRedux.instance = MockNgRedux.mockInstance as any;
  }

  /**
   * Gets the singleton MockNgRedux instance. Useful for cases where your
   * tests need to spy on store methods, for example.
   */
  static getInstance() {
    MockNgRedux.mockInstance = MockNgRedux.mockInstance || new MockNgRedux();
    return MockNgRedux.mockInstance;
  }
  //
  private mockRootStore = new MockObservableStore<any>();

  configureSubStore = this.mockRootStore.configureSubStore as any;
  dispatch = this.mockRootStore.dispatch as Dispatch<any>;
  getState = this.mockRootStore.getState as any;
  subscribe = this.mockRootStore.subscribe;
  replaceReducer = this.mockRootStore.replaceReducer;
  select: <SelectedType>(
    selector?: Selector<T, SelectedType>,
    comparator?: Comparator,
  ) => Observable<SelectedType> = this.mockRootStore.select;

  /** @hidden */
  constructor() {
    super();
    // This hooks the mock up to @select.
    NgRedux.instance = this as any;
  }

  provideStore = (_: Store<any>): void => undefined;
  configureStore = (
    _: Reducer<any, AnyAction>,
    __: any,
    ___?: Middleware[],
    ____?: StoreEnhancer<any>[],
  ): void => undefined;
}
