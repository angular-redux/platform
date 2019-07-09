import { UPDATE_LOCATION } from './actions';
import { NgReduxRouterModule } from './module';
import { RouterAction, routerReducer } from './reducer';
import { NgReduxRouter } from './router';

// Warning: don't do this:
//  export * from './foo'
// ... because it breaks rollup. See
// https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module
export {
  NgReduxRouter,
  NgReduxRouterModule,
  RouterAction,
  routerReducer,
  UPDATE_LOCATION,
};
