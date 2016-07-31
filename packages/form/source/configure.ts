import { provide } from '@angular/core';

import { NgRedux } from 'ng2-redux';

import { Store } from 'redux';

import { FormActions } from './form-actions';

export const provideReduceForms = <T>(arg: Store<T> | NgRedux<T>) => {
  return [
    provide(FormActions, {
      useValue: new FormActions(action => arg.dispatch(action))
    })
  ];
};