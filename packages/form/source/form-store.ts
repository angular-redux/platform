import {Injectable} from '@angular/core';

import {NgForm} from '@angular/forms';

import {NgRedux} from '@angular-redux/store';

import {Action, Unsubscribe} from 'redux';

export interface AbstractStore<RootState> {
  /// Dispatch an action
  dispatch(action: Action & {payload}): void;

  /// Retrieve the current application state
  getState(): RootState;

  /// Subscribe to changes in the store
  subscribe(fn: (state: RootState) => void): Unsubscribe;
}

export const FORM_CHANGED = '@@angular-redux/form/FORM_CHANGED';

@Injectable()
export class FormStore {
  /// NOTE(cbond): The declaration of store is misleading. This class is
  /// actually capable of taking a plain Redux store or an NgRedux instance.
  /// But in order to make the ng dependency injector work properly, we
  /// declare it as an NgRedux type, since the @angular-redux/store use case involves
  /// calling the constructor of this class manually (from configure.ts),
  /// where a plain store can be cast to an NgRedux. (For our purposes, they
  /// have almost identical shapes.)
  constructor(private store: NgRedux<any>) {}

  getState() {
    return this.store.getState();
  }

  subscribe(fn: (state) => void): Unsubscribe {
    return this.store.subscribe(() => fn(this.getState()));
  }

  valueChanged<T>(path: string[], form: NgForm, value: T) {
    this.store.dispatch({
      type: FORM_CHANGED,
      payload: {
        path,
        form,
        valid: form.valid === true,
        value
      }
    });
  }
}
