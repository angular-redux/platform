import { ElephantsActions } from '../elephants/elephants.actions';
import { IPayloadAction } from '../utils/payload-action';

export function elephantsReducer(state = [], action: IPayloadAction) {
  switch (action.type) {
    case ElephantsActions.LOAD_SUCCEEDED:
      return action.payload;
    case ElephantsActions.LOAD_FAILED:
      return action.error;
  }

  return state;
}
