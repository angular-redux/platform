// TODO: See if this linting rule can be enabled with new build process (ng-packagr)
// tslint:disable:no-implicit-dependencies
import { DevToolsExtension, NgRedux } from '@angular-redux/store';
import { NgModule } from '@angular/core';
import { MockDevToolsExtension } from './dev-tools.mock';
import { MockNgRedux } from './ng-redux.mock';

// Needs to be initialized early so @select's use the mocked version too.
const mockNgRedux = MockNgRedux.getInstance();

/** @hidden */
export function _mockNgReduxFactory() {
  return mockNgRedux;
}

@NgModule({
  imports: [],
  providers: [
    { provide: NgRedux, useFactory: _mockNgReduxFactory },
    { provide: DevToolsExtension, useClass: MockDevToolsExtension },
  ],
})
export class NgReduxTestingModule {}
