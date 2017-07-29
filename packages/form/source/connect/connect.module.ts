import { NgModule } from '@angular/core';

import { Connect } from './connect';
import { ReactiveConnect } from './connect-reactive';

const declarations = [Connect, ReactiveConnect];

@NgModule({
  declarations: [...declarations],
  exports: [...declarations],
})
export class NgReduxFormConnectModule {}
