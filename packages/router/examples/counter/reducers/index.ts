import * as Redux from 'redux';
const { combineReducers } = Redux;
import { RootState } from '../store';
import counter from './counter';
import { routerReducer } from '@angular-redux/router';

const rootReducer = combineReducers<RootState>({
  counter: counter,
  router: routerReducer
});

export default rootReducer;
