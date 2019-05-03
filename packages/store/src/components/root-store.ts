import {
  AnyAction,
  applyMiddleware,
  compose,
  createStore,
  Dispatch,
  Middleware,
  Reducer,
  Store,
  StoreCreator,
  StoreEnhancer,
  Unsubscribe,
} from 'redux';

import { NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { assert } from '../utils/assert';
import { enableFractalReducers } from './fractal-reducer-map';
import { NgRedux } from './ng-redux';
import { ObservableStore } from './observable-store';
import {
  Comparator,
  PathSelector,
  resolveToFunctionSelector,
  Selector,
} from './selectors';
import { SubStore } from './sub-store';

/** @hidden */
export class RootStore<RootState> extends NgRedux<RootState> {
  private store: Store<RootState> | undefined = undefined;
  private store$: BehaviorSubject<RootState>;

  constructor(private ngZone: NgZone) {
    super();

    NgRedux.instance = this;
    this.store$ = new BehaviorSubject<RootState | undefined>(undefined).pipe(
      filter(n => n !== undefined),
      switchMap(observableStore => observableStore as any),
      // TODO: fix this? needing to explicitly cast this is wrong
    ) as BehaviorSubject<RootState>;
  }

  configureStore = (
    rootReducer: Reducer<RootState, AnyAction>,
    initState: RootState,
    middleware: Middleware[] = [],
    enhancers: StoreEnhancer<RootState>[] = [],
  ): void => {
    assert(!this.store, 'Store already configured!');
    // Variable-arity compose in typescript FTW.
    this.setStore(
      compose<StoreCreator>(
        applyMiddleware(...middleware),
        ...enhancers,
      )(createStore)(enableFractalReducers(rootReducer), initState),
    );
  };

  provideStore = (store: Store<RootState>) => {
    assert(!this.store, 'Store already configured!');
    this.setStore(store);
  };

  getState = (): RootState => this.store!.getState();

  subscribe = (listener: () => void): Unsubscribe =>
    this.store!.subscribe(listener);

  replaceReducer = (nextReducer: Reducer<RootState, AnyAction>): void => {
    this.store!.replaceReducer(nextReducer);
  };

  dispatch: Dispatch<AnyAction> = <A extends AnyAction>(action: A): A => {
    assert(
      !!this.store,
      'Dispatch failed: did you forget to configure your store? ' +
        'https://github.com/angular-redux/platform/blob/master/packages/store/' +
        'README.md#quick-start',
    );

    if (!NgZone.isInAngularZone()) {
      return this.ngZone.run(() => this.store!.dispatch(action));
    } else {
      return this.store!.dispatch(action);
    }
  };

  select = <SelectedType>(
    selector?: Selector<RootState, SelectedType>,
    comparator?: Comparator,
  ): Observable<SelectedType> =>
    this.store$.pipe(
      distinctUntilChanged(),
      map(resolveToFunctionSelector(selector)),
      distinctUntilChanged(comparator),
    );

  configureSubStore = <SubState>(
    basePath: PathSelector,
    localReducer: Reducer<SubState, AnyAction>,
  ): ObservableStore<SubState> =>
    new SubStore<SubState>(this, basePath, localReducer);

  private setStore(store: Store<RootState>) {
    this.store = store;
    const storeServable = this.storeToObservable(store);
    this.store$.next(storeServable as any);
  }

  private storeToObservable = (
    store: Store<RootState>,
  ): Observable<RootState> =>
    new Observable<RootState>((observer: Observer<RootState>) => {
      observer.next(store.getState());
      const unsubscribeFromRedux = store.subscribe(() =>
        observer.next(store.getState()),
      );
      return () => {
        unsubscribeFromRedux();
        observer.complete();
      };
    });
}
