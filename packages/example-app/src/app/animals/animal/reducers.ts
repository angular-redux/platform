import { Reducer, Action } from 'redux';
import { AnimalComponent } from './component';

export const ticketsReducer: Reducer<number> = (state = 0, action: Action): number => {
  switch (action.type) {
    case AnimalComponent.ADD_TICKET: return state + 1;
    case AnimalComponent.REMOVE_TICKET: return Math.max(0, state - 1);
  }
  return state;
}

// Basic reducer logic.
export const animalComponentReducer: Reducer<any> = (state: any = {}, action: Action): {} => ({
  ...state,
  tickets: ticketsReducer(state.tickets, action),
});
