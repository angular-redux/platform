import { ApplicationRef, Injectable, NgZone } from '@angular/core';
import { Unsubscribe } from 'redux';
import { NgRedux } from './ng-redux';

declare const window: any;
const environment: any = typeof window !== 'undefined' ? window : {};

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
  enhancer = (options?: object) => {
    let subscription: Unsubscribe;
    if (!this.isEnabled()) {
      return null;
    }

    // Make sure changes from dev tools update angular's view.
    environment.devToolsExtension.listen(({ type }: any) => {
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

    return environment.devToolsExtension(options);
  };

  /**
   * Returns true if the extension is installed and enabled.
   */
  isEnabled = () => environment && environment.devToolsExtension;
}
