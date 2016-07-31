import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';
import { Store } from 'redux';
import { Observable } from 'rxjs';

@Injectable()
export class FormActions<TReduce> {
  static FORM_VALUE_CHANGED = '@@redux-form/FORM_VALUE_CHANGED';

  constructor(private store: Observable<TReduce> | Store<TReduce>) {}

  valueChanged<T>(form: Form, connectKey: string, value: T) {
    debugger;
  }
}
