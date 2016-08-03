import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Action, Store } from 'redux';

export interface AbstractStore<RootState> {
  /// Dispatch an action
  dispatch(action: Action & {payload}): void;

  /// Retrieve the current application state
  getState(): RootState;

  /// Subscribe to changes in the store
  subscribe(fn: (state: RootState) => void): Redux.Unsubscribe;
}

export const FORM_CHANGED = '@@redux-form/FORM_CHANGED';

@Injectable()
export class FormStore<RootState> {
  constructor(private store: AbstractStore<RootState>) {}

  getState() {
    return this.store.getState();
  }

  subscribe(fn: (state: RootState) => void): Redux.Unsubscribe {
    return this.store.subscribe(fn);
  }

  valueChanged<T>(path: string[], form: NgForm, value: T) {
    this.store.dispatch({
      type: FORM_CHANGED,
      payload: {
        path,
        valid: form.valid === true,
        value
      }
    });
  }
}
