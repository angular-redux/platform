import { Reducer, Action } from 'redux';

import { FormActions } from './form-actions';

export const formReducer = <State>(state: State, action: Action): State => {
  switch (action.type) {
    default:
      return state;
  }
};