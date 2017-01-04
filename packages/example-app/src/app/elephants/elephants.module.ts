import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';

import { ElephantListComponent } from './elephant-list/elephant-list.component';
import { ElephantsEpics } from './elephants.epics';
import { ElephantsService } from './elephants.service';
import { ElephantsActions } from './elephants.actions';

@NgModule({
  declarations: [ ElephantListComponent ],
  providers: [
    ElephantsEpics,
    ElephantsService,
    ElephantsActions,
  ],
  imports: [ CommonModule ],
  exports: [ ElephantListComponent ],
})
export class ElephantsModule {}
