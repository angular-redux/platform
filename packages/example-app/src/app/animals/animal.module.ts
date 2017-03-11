import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../core/core.module';
import { AnimalListComponent } from './animal-list/animal-list.component';
import { AnimalActions } from './animal.actions';
import { AnimalEpics } from './animal.epics';
import { AnimalService } from './animal.service';
import { StoreModule } from '../store/store.module';

@NgModule({
  declarations: [AnimalListComponent],
  exports: [AnimalListComponent],
  imports: [CoreModule, StoreModule, CommonModule],
  providers: [AnimalActions, AnimalEpics, AnimalService],
})
export class AnimalModule {}
