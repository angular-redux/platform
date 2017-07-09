import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { Injectable, ApplicationRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd, NavigationCancel, DefaultUrlSerializer } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription'
import { UPDATE_LOCATION } from './actions';
import {
  RouterAction,
  DefaultRouterState
} from './reducer';

@Injectable()
export class NgReduxRouter {
  private initialized = false;
  private currentLocation: string;
  private initialLocation: string;

  private selectLocationFromState: (state: any) => string = (state) => state.router;
  private urlState: Observable<string>;

  private urlStateSubscription: ISubscription;
  private reduxSubscription: ISubscription;

  constructor(
    private router: Router,
    private ngRedux: NgRedux<any>,
    private applicationRef: ApplicationRef,
    private location: Location
  ) {}

  /**
   * Destroys the bindings between @angular-redux/router and @angular/router.
   * This method unsubscribes from both @angular-redux/router and @angular router, in case
   * your app needs to tear down the bindings without destroying Angular or Redux
   * at the same time.
   */
  destroy() {
    if (this.urlStateSubscription) {
      this.urlStateSubscription.unsubscribe();
    }

    if (this.reduxSubscription) {
      this.reduxSubscription.unsubscribe();
    }

    this.initialized = false;
  }

  /**
   * Initialize the bindings between @angular-redux/router and @angular/router
   *
   * This should only be called once for the lifetime of your app, for
   * example in the constructor of your root component.
   *
   *
   * @param {(state: any) => string} selectLocationFromState Optional: If your
   * router state is in a custom location, supply this argument to tell the
   * bindings where to find the router location in the state.
   * @param {Observable<string>} urlState$ Optional: If you have a custom setup
   * when listening to router changes, or use a different router than @angular/router
   * you can supply this argument as an Observable of the current url state.
   */
  initialize(
    selectLocationFromState: (state: any) => string = (state) => state.router,
    urlState$: Observable<string> | undefined = undefined
  ) {
    if (this.initialized) {
      throw new Error('@angular-redux/router already initialized! If you meant to re-initialize, call destroy first.');
    }

    this.selectLocationFromState = selectLocationFromState

    this.urlState = urlState$ || this.getDefaultUrlStateObservable();

    this.listenToRouterChanges();
    this.listenToReduxChanges();
    this.initialized = true;
  }

  private getDefaultUrlStateObservable() {
    return this.router.events
             .filter(event => event instanceof NavigationEnd)
             .map(event => this.location.path())
             .distinctUntilChanged()
  }

  private getLocationFromStore(useInitial: boolean = false) {
    return this.selectLocationFromState(this.ngRedux.getState()) ||
      (useInitial ? this.initialLocation : '');
  }

  private listenToRouterChanges() {
    const handleLocationChange = (location: string) => {
      if(this.currentLocation === location) {
        // Dont dispatch changes if we haven't changed location.
        return;
      }

      this.currentLocation = location;
      if (this.initialLocation === undefined) {
        this.initialLocation = location;

        // Fetch initial location from store and make sure
        // we dont dispath an event if the current url equals
        // the initial url.
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

    this.urlStateSubscription = this.urlState.subscribe(handleLocationChange);
  }

  private listenToReduxChanges() {
    const handleLocationChange = (location: string) => {
      if (this.initialLocation === undefined) {
        // Wait for router to set initial location.
        return;
      }

      let locationInStore = this.getLocationFromStore(true);
      if (this.currentLocation === locationInStore) {
        // Dont change router location if its equal to the one in the store.
        return;
      }

      this.currentLocation = location
      this.router.navigateByUrl(location);
    }

    this.reduxSubscription = this.ngRedux
      .select(state => this.selectLocationFromState(state))
      .distinctUntilChanged()
      .subscribe(handleLocationChange);
  }
}
