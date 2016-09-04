import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {NgRedux} from 'ng2-redux';

import {Connect} from './connect';
import {ConnectArray} from './connect-array';
import {FormStore} from './form-store';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    Connect,
    ConnectArray,
  ],
  exports: [
    Connect,
    ConnectArray,
  ],
  providers: [
    {
      provide: FormStore,
      useFactory: (ngRedux: NgRedux<any>) => new FormStore(<any>ngRedux),
      deps: [NgRedux],
    },
  ]
})
export class NgReduxForms {}
