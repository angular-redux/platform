import { ApplicationRef, Injectable, NgZone } from '@angular/core';
import { AnyAction, StoreEnhancer, Unsubscribe } from 'redux';
import { EnhancerOptions } from 'redux-devtools-extension';
import { NgRedux } from './ng-redux';

export interface ReduxDevTools {
  (options: EnhancerOptions): StoreEnhancer<any>;
  listen: (
    onMessage: (message: AnyAction) => void,
    instanceId?: string,
  ) => void;
}

interface WindowWithReduxDevTools extends Window {
  __REDUX_DEVTOOLS_EXTENSION__?: ReduxDevTools;
  devToolsExtension?: ReduxDevTools;
}

const environment: WindowWithReduxDevTools = (typeof window !== 'undefined'
  ? window
  : {}) as WindowWithReduxDevTools;

/**
 * An angular-2-ified version of the Redux DevTools chrome extension.
 */
@Injectable()
export class DevToolsExtension {
  /** @hidden */
  constructor(private appRef: ApplicationRef, private ngRedux: NgRedux<any>) {}

  /**
   * A wrapper for the Chrome Extension Redux DevTools.
   * Makes sure state changes triggered by the extension
   * trigger Angular2's change detector.
   *
   * @argument options: dev tool options; same
   * format as described here:
   * [zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md]
   */
  enhancer = (options?: EnhancerOptions) => {
    let subscription: Unsubscribe;
    if (!this.isEnabled()) {
      return null;
    }

    // Make sure changes from dev tools update angular's view.
    this.getDevTools()!.listen(({ type }) => {
      if (type === 'START') {
        subscription = this.ngRedux.subscribe(() => {
          if (!NgZone.isInAngularZone()) {
            this.appRef.tick();
          }
        });
      } else if (type === 'STOP') {
        subscription();
      }
    });

    return this.getDevTools()!(options || {});
  };

  /**
   * Returns true if the extension is installed and enabled.
   */
  isEnabled = () => !!this.getDevTools();

  /**
   * Returns the redux devtools enhancer.
   */
  getDevTools = () =>
    environment &&
    (environment.__REDUX_DEVTOOLS_EXTENSION__ || environment.devToolsExtension);
}
