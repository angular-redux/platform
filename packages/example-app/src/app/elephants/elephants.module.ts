import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';

import { ElephantListComponent } from './elephant-list/elephant-list.component';
import { ElephantsEpics } from './elephants.epics';
import { ElephantsService } from './elephants.service';
import { ElephantsActions } from './elephants.actions';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [ ElephantListComponent ],
  providers: [
    ElephantsEpics,
    ElephantsService,
    ElephantsActions,
  ],
  imports: [
    CommonModule,
    CoreModule,
  ],
  exports: [ ElephantListComponent ],
})
export class ElephantsModule {}
