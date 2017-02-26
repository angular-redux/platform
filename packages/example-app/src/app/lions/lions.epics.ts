import { Injectable } from '@angular/core';
import { Epic } from 'redux-observable';
import { Action, Store } from 'redux';
import { AppActions } from '../app.actions';
import { of } from 'rxjs/observable/of';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { LionsService } from './lions.service';
import { LionsActions } from './lions.actions';

@Injectable()
export class LionsEpics {
  epics: Epic<Action, Store<any>>[];

  constructor(
    private service: LionsService,
    private actions: LionsActions
  ) {
    this.epics = [ this.loadLions ];
  }

  loadLions = action$ => action$
    .ofType(AppActions.LOAD_DATA)
    .switchMap(a => this.service.getAll()
      .map(data => this.actions.loadSucceeded(data))
      .catch(response => of(this.actions.loadFailed(response.status))));
}
