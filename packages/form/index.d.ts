declare namespace 'ng2-redux-form' {
  import {Provider} from '@angular/core';
  import {QueryList} from '@angular/core';
  import {NgForm, NgControl} from '@angular/forms';
  import {Action, Store} from 'redux';
  import {NgRedux} from 'ng2-redux';
  import {Iterable} from 'immutable';

  export const provideFormConnect: <T>(arg: Store<T> | NgRedux<T>) => Provider[];

  export function composeReducers<State>(
    ...reducers: (<A extends Action>(state: State, action: A) => State)[]) =>
  <A extends Action>(state: State, action: A) => State;

  export class Connect<RootState> {
    /// The path to the piece of state that this form is connecting to
    connect: () => (string | string[]) | string | string[];

    /// The control path of this directive (up to the root form)
    path: string[];

    constructor(children: QueryList<NgControl>, store: FormStore<RootState>, form: NgForm);

    /// Update the form models with the latest state from the {@link AbstractStore}
    protected resetState(): void;

    /// Publish new form input values to the store
    protected publish<T>(value: T): void;
  }

  export class FormException extends Error {}

  export function defaultFormReducer<RootState>(
    initialState?: RootState | Iterable.Keyed<string, any>) =>
  (state: RootState | Iterable.Keyed<string, any>, action: Redux.Action & {payload?}) => any;

  /// The store you provide in your call to {@link provideFormConnect} must conform to the
  /// contract described by AbstractStore. Both NgRedux and redux.Store conform. If you
  /// wish to supply a store that is neither an NgRedux store or a redux store, you can do
  /// it as long as your custom store is the same shape as AbstractStore<RootState>. The
  /// type argument of AbstractStore is your root application state interface.
  export interface AbstractStore<RootState> {
    /// Dispatch an action to the store
    dispatch(action: Action & {payload?}): void;

    /// Get current application state
    getState(): RootState;

    /// Subscribe to store changes
    subscribe(fn: (state: RootState) => void): Redux.Unsubscribe;
  }

  /// This is the action dispatched when form values change.
  export const FORM_CHANGED: string;

  export interface Operations<T> {
    /// Clone this object
    clone(): T;

    /// Merge the contents of {@link value} with this object ({@link key} is optional)
    merge(key: number | string, value: T): any;

    /// Update the values of this object with {@link value}
    update(key: number | string, value: T): any;
  }

  export interface TraverseCallback {
    (parent: any, key: number | string, remainingPath: string[], value?: any): any;
  }

  /// Methods to extract and assign state. Use the {@link inspect} method to retrieve an
  /// {@link Operations<T>} object that you can use to clone, merge or update a state
  /// object. The primary feature of {@link State} is that it works with objects of any
  /// type: Map, WeakMap, Set, WeakSet, ImmutableJS, and any. Your state can mix and
  /// match these types in any way you like and the assign/get operations will still work.
  /// You could have a Map nested inside an Immutable map nested inside of an array,
  /// for example. The {@param path} argument specifies the path that will be taken when
  /// doing these operations.
  export abstract class State {
    static traverse<State>(state: State, path: string[], fn?: TraverseCallback): State;
    static get<State>(state: State, path: string[]): any;
    static assign<State>(state: State, path: string[], value): any;
    static inspect<K>(object: K): Operations<K>;
    static empty(value: any): boolean;
  }
}
