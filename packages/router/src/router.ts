import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { Injectable, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgRedux } from 'ng2-redux';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UPDATE_LOCATION } from './actions';
import {
  RouterAction,
  DefaultRouterState,
  getLocationFromState
} from './reducer';

@Injectable()
export class NgReduxRouter {
  private stateLocation: BehaviorSubject<string>;

  constructor(
    private location: Location,
    private router: Router,
    private ngRedux: NgRedux<any>,
    private applicationRef: ApplicationRef
  ) {}

  initialize() {
    this.stateLocation = new BehaviorSubject('');

    this.ngRedux
      .select(state => getLocationFromState(state))
      .distinctUntilChanged()
      .subscribe(location => this.stateLocation.next(location));

    this.listenForRouterChangesAndDispatch();
    this.subscribeToReduxChanges();
  }

  listenForRouterChangesAndDispatch() {
    this.router.changes
      .map(() => this.location.path())
      .distinctUntilChanged()
      .filter(location => location != this.stateLocation.getValue())
      .subscribe(location => {
        this.ngRedux.dispatch(<RouterAction>{
          type: UPDATE_LOCATION,
          payload: location
        });
      });
  }

  subscribeToReduxChanges() {
    // Apparently navigating by url doesnt trigger angulars change detection,
    // Need to do this manually then via ApplicationRef.
    this.stateLocation.subscribe(location => {
      this.router
        .navigateByUrl(location)
        .then(() => this.applicationRef.tick());
    });
  }
}
