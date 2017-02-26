// This is the application's top-level NgModule definition.
//
// Think of it as a wirings file: telling Angular where to
// find our components and services, and telling Angular-redux
// where to find our reducers, middleware, and epics.

// Basic Angular stuff.
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

// Angular-redux ecosystem stuff.
// @angular-redux/form and @angular-redux/router are optional
// extensions that sync form and route location state between
// our store and Angular.
import { NgReduxModule, NgRedux, DevToolsExtension } from '@angular-redux/store';
import { NgReduxRouterModule, NgReduxRouter, routerReducer } from '@angular-redux/router';
import { provideReduxForms, composeReducers, defaultFormReducer } from '@angular-redux/form';

// Redux ecosystem stuff.
import { combineReducers } from 'redux';
import * as createLogger from 'redux-logger';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

// Top-level app component constructs.
import { appRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { AppActions } from './app.actions';

// Elephants module constructs.
import { ElephantsModule } from './elephants/elephants.module';
import { ElephantsEpics } from './elephants/elephants.epics';
import { elephantsReducer } from './elephants/elephants.reducer';

// Lions module constructs.
import { LionsModule } from './lions/lions.module';
import { LionsEpics } from './lions/lions.epics';
import { lionsReducer } from './lions/lions.reducer';

// Feedback module constructs.
import { FeedbackModule } from './feedback/feedback.module';

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    HttpModule,
    NgReduxModule,
    NgReduxRouterModule,
    ElephantsModule,
    LionsModule,
    FeedbackModule,
  ],
  providers: [ AppActions ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor(
    private ngRedux: NgRedux<any>,
    private actions: AppActions,
    devTools: DevToolsExtension,
    ngReduxRouter: NgReduxRouter,
    elephantsEpics: ElephantsEpics,
    lionsEpics: LionsEpics
  ) {
    // Define the global store shape by combining our application's
    // reducers together into a given structure.
    const rootReducer = composeReducers(
      defaultFormReducer(),
      combineReducers({
        elephants: elephantsReducer,
        lions: lionsReducer,
        router: routerReducer,
    }));

    // Tell Redux about our reducers and epics. If the Redux DevTools
    // chrome extension is available in the browser, tell Redux about
    // it too.
    ngRedux.configureStore(
      rootReducer,
      {},
      [
        createLogger(),
        createEpicMiddleware(combineEpics(...elephantsEpics.epics)),
        createEpicMiddleware(combineEpics(...lionsEpics.epics)),
      ],
      devTools.isEnabled() ? [ devTools.enhancer() ] : []);

    // Enable syncing of Angular router state with our Redux store.
    ngReduxRouter.initialize();

    // Enable syncing of Angular form state with our Redux store.
    provideReduxForms(ngRedux);
  }
}
