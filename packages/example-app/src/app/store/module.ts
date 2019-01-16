import { NgModule } from '@angular/core';

// Angular-redux ecosystem stuff.
// @angular-redux/form and @angular-redux/router are optional
// extensions that sync form and route location state between
// our store and Angular.
import { provideReduxForms } from '@angular-redux/form';
// import { NgReduxRouter, NgReduxRouterModule } from '@angular-redux/router';
import {
  DevToolsExtension,
  NgRedux,
  NgReduxModule,
} from '@angular-redux/store';

// Redux ecosystem stuff.
import { FluxStandardAction } from 'flux-standard-action';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';

// The top-level reducers and epics that make up our app's logic.
import { RootEpics } from './epics';
import { AppState, initialAppState } from './model';
import { rootReducer } from './reducers';

@NgModule({
  imports: [NgReduxModule /*NgReduxRouterModule*/],
  providers: [RootEpics],
})
export class StoreModule {
  constructor(
    public store: NgRedux<AppState>,
    devTools: DevToolsExtension,
    // ngReduxRouter: NgReduxRouter,
    rootEpics: RootEpics,
  ) {
    // Tell Redux about our reducers and epics. If the Redux DevTools
    // chrome extension is available in the browser, tell Redux about
    // it too.
    const epicMiddleware = createEpicMiddleware<
      FluxStandardAction<any, any>,
      FluxStandardAction<any, any>,
      AppState
    >();

    store.configureStore(
      rootReducer,
      initialAppState(),
      [createLogger(), epicMiddleware],
      // configure store typings conflict with devTools typings
      (devTools.isEnabled() ? [devTools.enhancer()] : []) as any,
    );

    epicMiddleware.run(rootEpics.createEpics());

    // Enable syncing of Angular router state with our Redux store.
    // if (ngReduxRouter) {
    //   ngReduxRouter.initialize();
    // }

    // Enable syncing of Angular form state with our Redux store.
    provideReduxForms(store);
  }
}
