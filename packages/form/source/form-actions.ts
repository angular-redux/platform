import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';

import { Action, Store } from 'redux';

export interface AbstractStore<RootState> {
  /// Dispatch an action
  dispatch(action: Action & {payload}): void;

  /// Retrieve the current application state
  getState(): RootState;
}

@Injectable()
export class FormActions<RootState> {
  static FORM_VALUE_CHANGED = '@@redux-form/FORM_VALUE_CHANGED';

  constructor(private store: AbstractStore<RootState>) {}

  getState() {
    return this.store.getState();
  }

  valueChanged<T>(connectKey: string, form: Form, value: T) {
    this.store.dispatch({
      type: FormActions.FORM_VALUE_CHANGED,
      payload: {
        connectKey,
        form,
        value
      }
    });
  }
}
