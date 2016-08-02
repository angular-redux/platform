import { provide } from '@angular/core';
import { FormControl } from '@angular/forms';

import { NgRedux } from 'ng2-redux';

import { Store } from 'redux';

import { FormActions } from './form-actions';

export const provideReduceForms = <T>(arg: Store<T> | NgRedux<T>) => {
  const abstractStore = {
    dispatch: action => arg.dispatch(action),
    getState: () => arg.getState()
  };

  return [
    provide(FormActions, {
      useValue: new FormActions(abstractStore)
    })
  ];
};