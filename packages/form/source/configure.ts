import { provide } from '@angular/core';
import { FormControl } from '@angular/forms';

import { NgRedux } from 'ng2-redux';

import { Store } from 'redux';

import { AbstractStore, FormStore } from './form-store';

export const provideReduceForms = <T>(arg: Store<T> | NgRedux<T>) => {
  const abstractStore: AbstractStore<T> = {
    dispatch: action => arg.dispatch(action),
    getState: () => arg.getState(),
    subscribe: fn => arg.subscribe(() => fn(arg.getState()))
  };

  return [
    provide(FormStore, {
      useValue: new FormStore(abstractStore)
    })
  ];
};