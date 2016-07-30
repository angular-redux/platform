import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from 'redux';
import { Observable } from 'rxjs';

@Injectable()
export class FormActions<TReduce, TForm> {
  static FORM_VALUE_CHANGED = '@@redux-form/FORM_VALUE_CHANGED';

  constructor(private store: Observable<TReduce> | Store<TReduce>) {}

  valueChanged<T>(control: FormControl, value: TForm) {
    debugger;
  }
}
