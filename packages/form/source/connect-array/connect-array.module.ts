import { NgModule } from '@angular/core';

import { ConnectArray } from './connect-array';

const declarations = [ConnectArray];

@NgModule({
  declarations: [...declarations],
  exports: [...declarations],
})
export class NgReduxFormConnectArrayModule {}
