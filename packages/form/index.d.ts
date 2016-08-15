declare namespace 'ng2-redux-form' {
  import { Provider } from '@angular/core';
  import { QueryList } from '@angular/core';
  import { NgForm, NgControl } from '@angular/forms';
  import { Action, Store } from 'redux';
  import { NgRedux } from 'ng2-redux';
  import { Iterable } from 'immutable';

  export const provideFormConnect: <T>(arg: Store<T> | NgRedux<T>) => Provider[];

  export function composeReducers<State>(
      ...reducers: (<A extends Action>(state: State, action: A) => State)[]) =>
    <A extends Action>(state: State, action: A) => State;

  export class Connect<RootState> {
      private children;
      private store;
      private form;
      connect: () => (string | string[]) | string | string[];
      private stateSubscription;
      private formSubscription;
      constructor(children: QueryList<NgControl>, store: FormStore<RootState>, form: NgForm);
      _parent: NgForm;
      path: string[];
      ngOnDestroy(): void;
      private ngAfterViewInit();
      private ngAfterContentInit();
      protected resetState(): void;
      protected publish(value: any): void;
      protected getState(): RootState;
  }

  export class FormException extends Error {}

  export function defaultFormReducer<RootState>(
      initialState?: RootState | Iterable.Keyed<string, any>) =>
    (state: RootState | Iterable.Keyed<string, any>, action: Redux.Action & {payload?}) => any;

  export interface AbstractStore<RootState> {
      dispatch(action: Action & {payload?}): void;
      getState(): RootState;
      subscribe(fn: (state: RootState) => void): Redux.Unsubscribe;
  }

  export const FORM_CHANGED: string;

  export class FormStore<RootState> {
      private store;
      constructor(store: AbstractStore<RootState>);
      getState(): RootState;
      subscribe(fn: (state: RootState) => void): Redux.Unsubscribe;
      valueChanged<T>(path: string[], form: NgForm, value: T): void;
  }

  export interface Operations<T> {
      clone(): T;
      update(key: number | string, value: T): any;
  }

  export interface TraverseCallback {
      (parent: any, key: number | string, remainingPath: string[], value?: any): any;
  }

  export abstract class State {
      static traverse<State>(state: State, path: string[], fn?: TraverseCallback): State;
      static get<State>(state: State, path: string[]): any;
      static assign<State>(state: State, path: string[], value?: any): any;
      static inspect<K>(object: K): Operations<K>;
      static empty(value: any): boolean;
  }
}
