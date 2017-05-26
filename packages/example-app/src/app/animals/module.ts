import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../core/module';
import { AnimalListComponent } from './animal-list/component';
import { AnimalAPIActions } from './api/actions';
import { AnimalAPIEpics } from './api/epics';
import { AnimalAPIService } from './api/service';
import { StoreModule } from '../store/module';

import { AnimalComponent } from './animal/component';

@NgModule({
  declarations: [AnimalListComponent, AnimalComponent],
  exports: [AnimalListComponent],
  imports: [CoreModule, StoreModule, CommonModule],
  providers: [AnimalAPIActions, AnimalAPIEpics, AnimalAPIService],
})
export class AnimalModule {}
