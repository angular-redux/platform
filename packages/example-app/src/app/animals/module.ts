import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '../core/module';
import { StoreModule } from '../store/module';
import { AnimalListComponent } from './animal-list/component';
import { AnimalAPIActions } from './api/actions';
import { AnimalAPIEpics } from './api/epics';
import { AnimalAPIService } from './api/service';

import { AnimalComponent } from './animal/component';
import { TicketActions } from './animal/ticket-actions';

@NgModule({
  declarations: [AnimalListComponent, AnimalComponent],
  exports: [AnimalListComponent],
  imports: [CoreModule, StoreModule, CommonModule],
  providers: [
    AnimalAPIActions,
    AnimalAPIEpics,
    AnimalAPIService,
    TicketActions,
  ],
})
export class AnimalModule {}
