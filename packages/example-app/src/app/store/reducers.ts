import { composeReducers, defaultFormReducer } from '@angular-redux/form';
// import { routerReducer } from '@angular-redux/router';
import { combineReducers } from 'redux';

import { createAnimalAPIReducer } from '../animals/api/reducer';
import { ANIMAL_TYPES } from '../animals/model';

const elephant = createAnimalAPIReducer(ANIMAL_TYPES.ELEPHANT);
// Define the global store shape by combining our application's
// reducers together into a given structure.
export const rootReducer = composeReducers(
  defaultFormReducer<any>(),
  combineReducers({
    elephant,
    lion: createAnimalAPIReducer(ANIMAL_TYPES.LION),
    // router: routerReducer,
  }),
);
