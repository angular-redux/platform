import { indexBy, prop } from 'ramda';
import { Action } from 'redux';
import { Animal, AnimalList, AnimalType } from '../model';
import { AnimalAPIAction, AnimalAPIActions } from './actions';

const INITIAL_STATE: AnimalList = {
  items: {},
  loading: false,
  error: null,
};

// A higher-order reducer: accepts an animal type and returns a reducer
// that only responds to actions for that particular animal type.
export function createAnimalAPIReducer(animalType: AnimalType) {
  return function animalReducer(
    state: AnimalList = INITIAL_STATE,
    a: Action,
  ): AnimalList {
    const action = a as AnimalAPIAction;
    if (!action.meta || action.meta.animalType !== animalType) {
      return state;
    }

    switch (action.type) {
      case AnimalAPIActions.LOAD_STARTED:
        return {
          ...state,
          items: {},
          loading: true,
          error: null,
        };
      case AnimalAPIActions.LOAD_SUCCEEDED:
        return {
          ...state,
          items: indexBy<Animal>(prop('id'), action.payload!),
          loading: false,
          error: null,
        };
      case AnimalAPIActions.LOAD_FAILED:
        return {
          ...state,
          items: {},
          loading: false,
          error: action.error,
        };
    }

    return state;
  };
}
