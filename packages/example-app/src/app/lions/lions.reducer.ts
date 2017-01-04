import { LionsActions } from '../lions/lions.actions';
import { IPayloadAction } from '../utils/payload-action';

export function lionsReducer(state = [], action: IPayloadAction) {
  switch (action.type) {
    case LionsActions.LOAD_SUCCEEDED:
      return action.payload;
    case LionsActions.LOAD_FAILED:
      return action.error;
  }

  return state;
}
