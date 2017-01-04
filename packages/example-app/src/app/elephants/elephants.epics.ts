import { Injectable } from '@angular/core';
import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { AppActions } from '../app.actions';
import { of } from 'rxjs/observable/of';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ElephantsService } from './elephants.service';
import { ElephantsActions } from './elephants.actions';

@Injectable()
export class ElephantsEpics {
  epics: Epic<Action>[];

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
      .catch(err => of(this.actions.loadFailed(err))));
}
