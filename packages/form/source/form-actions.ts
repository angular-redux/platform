import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';

import { Action, Store } from 'redux';

@Injectable()
export class FormActions<RootState> {
  static FORM_VALUE_CHANGED = '@@redux-form/FORM_VALUE_CHANGED';

  constructor(private dispatch: (action: Action & {payload}) => void) {}

  valueChanged<T>(connectKey: string, form: Form, value: T) {
    this.dispatch({
      type: FormActions.FORM_VALUE_CHANGED,
      payload: {
        connectKey,
        form,
        value
      }
    });
  }
}
