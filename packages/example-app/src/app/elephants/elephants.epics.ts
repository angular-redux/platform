import { Injectable } from '@angular/core';
import { Epic } from 'redux-observable';
import { Action, Store } from 'redux';
import { of } from 'rxjs/observable/of';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AppActions } from '../app.actions';
import { ElephantsService } from './elephants.service';
import { ElephantsActions } from './elephants.actions';

@Injectable()
export class ElephantsEpics {
  epics: Epic<Action, Store<any>>[];

  constructor(
    private service: ElephantsService,
    private actions: ElephantsActions
  ) {
    this.epics = [ this.loadElephants ];
  }

  loadElephants = action$ => action$
    .ofType(AppActions.LOAD_DATA)
    .switchMap(a => this.service.getAll()
      .map(data => this.actions.loadSucceeded(data))
      .catch(response => of(this.actions.loadFailed({
        status: ''+response.status,
      }))));
}
