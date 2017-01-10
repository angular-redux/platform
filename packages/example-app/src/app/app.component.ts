import { Component } from '@angular/core';
import { NgRedux, DevToolsExtension } from '@angular-redux/store';
import { NgReduxRouter, routerReducer } from '@angular-redux/router';
import { Action, combineReducers } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import { AppActions } from './app.actions';
import { ElephantsEpics } from './elephants/elephants.epics';
import { elephantsReducer } from './elephants/elephants.reducer';

import { LionsEpics } from './lions/lions.epics';
import { lionsReducer } from './lions/lions.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Welcome to the Zoo';

  constructor(
    private ngRedux: NgRedux<any>,
    private actions: AppActions,
    devTools: DevToolsExtension,
    ngReduxRouter: NgReduxRouter,
    elephantsEpics: ElephantsEpics,
    lionsEpics: LionsEpics
  ) {
    const rootReducer = combineReducers({
      elephants: elephantsReducer,
      lions: lionsReducer,
      router: routerReducer,
    });

    ngRedux.configureStore(
      rootReducer,
      {},
      [
        createEpicMiddleware(combineEpics(...elephantsEpics.epics)),
        createEpicMiddleware(combineEpics(...lionsEpics.epics)),
      ],
      devTools.isEnabled() ? [ devTools.enhancer() ] : null);
    ngReduxRouter.initialize(/* args */);
  }

  ngOnInit() {
    this.ngRedux.dispatch(this.actions.loadData());
  }
}
