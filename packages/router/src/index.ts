import { ModuleWithProviders } from '@angular/core';
import { NgModule } from '@angular/core';
import { NgReduxRouter } from './router';
import { RouterAction, routerReducer } from './reducer';
import { UPDATE_LOCATION } from './actions';

@NgModule()
export class NgReduxRouterModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgReduxRouterModule,
      providers: [NgReduxRouter]
    };
  }
}

export { NgReduxRouter, RouterAction, routerReducer, UPDATE_LOCATION };
