import { Action } from 'redux';

export interface IPayloadAction extends Action {
  payload?: any;
  error?: any;
}
