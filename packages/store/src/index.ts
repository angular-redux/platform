import { DevToolsExtension } from './components/dev-tools';
import { enableFractalReducers } from './components/fractal-reducer-map';
import { NgRedux } from './components/ng-redux';
import { ObservableStore } from './components/observable-store';
import {
  Comparator,
  FunctionSelector,
  PathSelector,
  PropertySelector,
  Selector,
  Transformer,
} from './components/selectors';
import { dispatch } from './decorators/dispatch';
import { select, select$ } from './decorators/select';
import { WithSubStore } from './decorators/with-sub-store';
import { NgReduxModule } from './ng-redux.module';

// Warning: don't do this:
//  export * from './foo'
// ... because it breaks rollup. See
// https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module
export {
  NgRedux,
  Selector,
  PathSelector,
  PropertySelector,
  FunctionSelector,
  Comparator,
  Transformer,
  NgReduxModule,
  DevToolsExtension,
  enableFractalReducers,
  select,
  select$,
  dispatch,
  WithSubStore,
  ObservableStore,
};
