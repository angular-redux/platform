import { Component } from '@angular/core';
import { NgRedux, DevToolsExtension } from 'ng2-redux';
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
    elephantsEpics: ElephantsEpics,
    lionsEpics: LionsEpics
  ) {
    const rootReducer = combineReducers({
      elephants: elephantsReducer,
      lions: lionsReducer,
    });

    ngRedux.configureStore(
      rootReducer,
      {},
      [
        createEpicMiddleware(combineEpics(...elephantsEpics.epics)),
        createEpicMiddleware(combineEpics(...lionsEpics.epics)),
      ],
      devTools.isEnabled() ? [ devTools.enhancer() ] : null);
  }

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.ngRedux.dispatch(this.actions.loadData());
  }
}
