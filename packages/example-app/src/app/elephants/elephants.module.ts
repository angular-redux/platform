import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElephantsPageComponent } from './elephants-page.container';
import { ElephantsEpics } from './elephants.epics';
import { ElephantsService } from './elephants.service';
import { ElephantsActions } from './elephants.actions';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [ElephantsPageComponent],
  exports: [ElephantsPageComponent],
  providers: [
    ElephantsEpics,
    ElephantsService,
    ElephantsActions,
  ],
  imports: [
    CommonModule,
    CoreModule,
  ],
})
export class ElephantsModule {}
