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
  private initialLocation: string;
  private selectLocationFromState = (state) => state.router;

  constructor(
    private location: Location,
    private router: Router,
    private ngRedux: NgRedux<any>,
    private applicationRef: ApplicationRef
  ) {}

  initialize(selectLocationFromState = (state) => state.router) {
    this.selectLocationFromState = selectLocationFromState
    this.listenToRouterChanges();
    this.listenToReduxChanges();
  }

  getState() {
    return this.ngRedux.getState();
  }

  getLocationFromStore(useInitial: boolean = false) {
    return this.selectLocationFromState(this.getState()) ||
      (useInitial ? this.initialLocation : '');
  }

  listenToRouterChanges() {
    const handleLocationChange = (location: string) => {
      if(this.isTimeTravelling) {
        // The promise of the router returns before the emit of changes...
        this.isTimeTravelling = false;
        return;
      }

      this.currentLocation = location;

      if (this.initialLocation === undefined) {
        this.initialLocation = location;

        let locationFromStore = this.getLocationFromStore();
        if(locationFromStore === this.currentLocation) {
          return;
        }
      }

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

  listenToReduxChanges() {
    const handleLocationChange = (location: string) => {
      if (this.initialLocation === undefined) {
        // Wait for router to set initial location.
        return;
      }

      let locationInStore = this.getLocationFromStore(true);
      if (this.currentLocation === locationInStore) {
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
      .select(state => this.selectLocationFromState(state))
      .distinctUntilChanged()
      .subscribe(handleLocationChange);
  }
}
