import { Action } from 'redux';

import { UPDATE_LOCATION } from './actions';

export const DefaultRouterState: string = '';

export interface RouterAction extends Action {
  payload: string
}

export function routerReducer(state: string = DefaultRouterState, action: RouterAction): string {
  switch (action.type) {
    case UPDATE_LOCATION:
      return action.payload || DefaultRouterState;
    default:
      return state;
  }
}

export function getLocationFromState(state) {
  return state.router;
}
