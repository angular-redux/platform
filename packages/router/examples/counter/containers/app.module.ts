import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing, AuthGuard } from '../routes';
import { NgReduxModule, NgRedux } from '@angular-redux/core';
import { NgReduxRouterModule, NgReduxRouter } from '@angular-redux/router';
import { Counter } from '../components/Counter';
import { CounterInfo } from '../components/CounterInfo';

import { AppComponent, FirstComponent, SecondComponent, ThirdComponent } from './app.component';

import { RootState, enhancers } from '../store';

import reducer from '../reducers/index';
const createLogger = require('redux-logger');

@NgModule({
  imports: [
    BrowserModule,
    routing,
    NgReduxModule,
    NgReduxRouterModule
  ],
  declarations: [
    AppComponent,
    FirstComponent,
    SecondComponent,
    ThirdComponent,
    Counter,
    CounterInfo
  ],
  providers: [
    AuthGuard
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
  constructor(
    ngRedux: NgRedux<RootState>,
    ngReduxRouter: NgReduxRouter
  ) {
    ngRedux.configureStore(
        reducer,
        { counter: 0 },
        [ createLogger() ],
        enhancers
    );
    ngReduxRouter.initialize();
  }
}
