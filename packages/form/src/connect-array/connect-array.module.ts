import { NgModule } from '@angular/core';

import { ConnectArrayDirective } from './connect-array.directive';

const declarations = [ConnectArrayDirective];

@NgModule({
  declarations: [...declarations],
  exports: [...declarations],
})
export class NgReduxFormConnectArrayModule {}
