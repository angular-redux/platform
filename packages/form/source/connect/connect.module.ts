import { NgModule } from '@angular/core';

import { ConnectDirective } from './connect';
import { ReactiveConnectDirective } from './connect-reactive';

const declarations = [ConnectDirective, ReactiveConnectDirective];

@NgModule({
  declarations: [...declarations],
  exports: [...declarations],
})
export class NgReduxFormConnectModule {}
