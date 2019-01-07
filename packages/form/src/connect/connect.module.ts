import { NgModule } from '@angular/core';

import { ReactiveConnectDirective } from './connect-reactive';
import { ConnectDirective } from './connect.directive';

const declarations = [ConnectDirective, ReactiveConnectDirective];

@NgModule({
  declarations: [...declarations],
  exports: [...declarations],
})
export class NgReduxFormConnectModule {}
