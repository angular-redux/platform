import { Action } from 'redux';

export interface IPayloadAction<P, M> extends Action {
  payload?: P;
  error?: any;
  meta?: M;
}
