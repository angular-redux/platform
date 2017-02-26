import { AppActions } from '../app.actions';
import { LionsActions } from './lions.actions';
import { IPayloadAction } from '../utils/payload-action';

export interface ILions {
  items: any[];
  loading: boolean;
  error?: any;
}

const INITIAL_STATE: ILions = {
  items: [],
  loading: false,
  error: null,
};

export function lionsReducer(
  state: ILions = INITIAL_STATE,
  action: IPayloadAction): ILions {
  switch (action.type) {
    case AppActions.LOAD_DATA:
      return {
        items: [],
        loading: true,
        error: null,
      };
    case LionsActions.LOAD_SUCCEEDED:
      return {
        items: action.payload,
        loading: false,
        error: null
      };
    case LionsActions.LOAD_FAILED:
      return {
        items: [],
        loading: false,
        error: action.error
      };
  }

  return state;
}
