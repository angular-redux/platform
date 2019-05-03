import { Action, Reducer } from 'redux';

import { Animal } from '../model';
import { ADD_TICKET, REMOVE_TICKET } from './actions';

export const ticketsReducer: Reducer<number> = (
  state = 0,
  action: Action,
): number => {
  switch (action.type) {
    case ADD_TICKET:
      return state + 1;
    case REMOVE_TICKET:
      return Math.max(0, state - 1);
  }
  return state;
};

// Basic reducer logic.
export const animalComponentReducer = (
  state: Animal | undefined,
  action: Action,
) =>
  state
    ? {
        ...state,
        tickets: ticketsReducer(state.tickets, action),
      }
    : {};
