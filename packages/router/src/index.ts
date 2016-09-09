import { NgModule } from '@angular/core';
import { NgReduxRouter } from './router';
import { RouterAction, routerReducer } from './reducer';
import { UPDATE_LOCATION } from './actions';

@NgModule({
  providers: [ NgReduxRouter ]
})
class NgReduxRouterModule { }

export {
  NgReduxRouterModule,
  NgReduxRouter,
  RouterAction,
  routerReducer,
  UPDATE_LOCATION
};
