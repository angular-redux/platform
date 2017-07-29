import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgRedux} from '@angular-redux/store';

import {NgReduxFormConnectModule} from './connect';
import {NgReduxFormConnectArrayModule} from './connect-array';
import {FormStore} from './form-store';

export function formStoreFactory(ngRedux: NgRedux<any>) {
  return new FormStore(ngRedux);
}

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgReduxFormConnectModule,
    NgReduxFormConnectArrayModule,
  ],
  exports: [
    NgReduxFormConnectModule,
    NgReduxFormConnectArrayModule
  ],
  providers: [
    {
      provide: FormStore,
      useFactory: formStoreFactory,
      deps: [NgRedux],
    },
  ],
})
export class NgReduxFormModule {}
