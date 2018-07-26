import { ModuleWithProviders, NgModule } from '@angular/core';
import { UPDATE_LOCATION } from './actions';
import { RouterAction, routerReducer } from './reducer';
import { NgReduxRouter } from './router';

@NgModule()
export class NgReduxRouterModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgReduxRouterModule,
      providers: [NgReduxRouter],
    };
  }
}

export { NgReduxRouter, RouterAction, routerReducer, UPDATE_LOCATION };
