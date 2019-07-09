import { ModuleWithProviders, NgModule } from '@angular/core';
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
