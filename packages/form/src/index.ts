import { composeReducers } from './compose-reducers';
import { provideReduxForms } from './configure';
import { FormException } from './form-exception';
import { defaultFormReducer } from './form-reducer';
import { AbstractStore, FORM_CHANGED, FormStore } from './form-store';
import { formStoreFactory, NgReduxFormModule } from './module';

import { ConnectBase, ControlPair } from './connect/connect-base';
import { ReactiveConnectDirective } from './connect/connect-reactive';
import { ConnectDirective } from './connect/connect.directive';
import { NgReduxFormConnectModule } from './connect/connect.module';

import { ConnectArrayTemplate } from './connect-array/connect-array-template';
import { ConnectArrayDirective } from './connect-array/connect-array.directive';
import { NgReduxFormConnectArrayModule } from './connect-array/connect-array.module';

// Warning: don't do this:
//  export * from './foo'
// ... because it breaks rollup. See
// https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module
export {
  AbstractStore,
  composeReducers,
  ConnectArrayDirective,
  ConnectArrayTemplate,
  ConnectBase,
  ConnectDirective,
  ControlPair,
  defaultFormReducer,
  FORM_CHANGED,
  FormException,
  FormStore,
  formStoreFactory,
  NgReduxFormConnectArrayModule,
  NgReduxFormConnectModule,
  NgReduxFormModule,
  provideReduxForms,
  ReactiveConnectDirective,
};
