import { combineReducers } from 'redux';
import { composeReducers, defaultFormReducer } from '@angular-redux/form';
import { routerReducer } from '@angular-redux/router';

import { createAnimalReducer } from '../animals/animal.reducer';
import { ANIMAL_TYPES } from '../animals/animal.types';

// Define the global store shape by combining our application's
// reducers together into a given structure.
export const rootReducer = composeReducers(
  defaultFormReducer(),
  combineReducers({
    elephants: createAnimalReducer(ANIMAL_TYPES.ELEPHANT),
    lions: createAnimalReducer(ANIMAL_TYPES.LION),
    router: routerReducer,
}));
