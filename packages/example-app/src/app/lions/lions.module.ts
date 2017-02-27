import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LionsPageComponent } from './lions-page.container';
import { LionsEpics } from './lions.epics';
import { LionsService } from './lions.service';
import { LionsActions } from './lions.actions';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [ LionsPageComponent ],
  exports: [ LionsPageComponent ],
  providers: [
    LionsEpics,
    LionsService,
    LionsActions,
  ],
  imports: [ CommonModule, CoreModule ],
})
export class LionsModule {}
