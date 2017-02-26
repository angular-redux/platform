import { AppActions } from '../app.actions';
import { ElephantsActions } from './elephants.actions';
import { IPayloadAction } from '../utils/payload-action';

export interface IElephants {
  items: any[];
  loading: boolean;
  error?: any;
}

const INITIAL_STATE: IElephants = {
  items: [],
  loading: false,
  error: null,
};

export function elephantsReducer(
  state: IElephants = INITIAL_STATE,
  action: IPayloadAction): IElephants {
  switch (action.type) {
    case AppActions.LOAD_DATA:
      return {
        items: [],
        loading: true,
        error: null,
      };
    case ElephantsActions.LOAD_SUCCEEDED:
      return {
        items: action.payload,
        loading: false,
        error: null
      };
    case ElephantsActions.LOAD_FAILED:
      return {
        items: [],
        loading: false,
        error: action.error
      };
  }

  return state;
}
