import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { Injectable, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgRedux } from 'ng2-redux';
import { UPDATE_LOCATION } from './actions';
import {
  RouterAction,
  DefaultRouterState
} from './reducer';

@Injectable()
export class NgReduxRouter {
  private isTimeTravelling: boolean;
  private currentLocation: string;
  private defaultSelectLocationState = (state) => state.router;

  constructor(
    private location: Location,
    private router: Router,
    private ngRedux: NgRedux<any>,
    private applicationRef: ApplicationRef
  ) {}

  initialize(selectLocationFromState = this.defaultSelectLocationState) {
    this.listenToRouterChanges();
    this.listenToReduxChanges(selectLocationFromState);
  }

  listenToRouterChanges() {
    const handleLocationChange = (location: string) => {
      if(this.isTimeTravelling) {
        // The promise of the router returns before the emit of changes...
        this.isTimeTravelling = false;
        return;
      }

      this.currentLocation = location;
      this.ngRedux.dispatch(<RouterAction>{
        type: UPDATE_LOCATION,
        payload: location
      });
    }

    this.router.changes
      .map(() => this.location.path())
      .distinctUntilChanged()
      .subscribe(handleLocationChange);
  }

  listenToReduxChanges(selectLocationFromState) {
    const handleLocationChange = (location: string) => {
      if (this.currentLocation === location) {
        return;
      }

      this.isTimeTravelling = true;
      this.currentLocation = location
      this.router
        .navigateByUrl(location)
        .then(() => {
          // Apparently navigating by url doesn't trigger Angular's change detection,
          // Need to do this manually then via ApplicationRef.
          this.applicationRef.tick();
        });
    }

    this.ngRedux
      .select(state => selectLocationFromState(state))
      .distinctUntilChanged()
      .subscribe(handleLocationChange);
  }
}
