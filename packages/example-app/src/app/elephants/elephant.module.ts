import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElephantPageComponent } from './elephant-page.container';
import { AnimalModule } from '../animals/animal.module';
import { CoreModule } from '../core/core.module';
import { StoreModule } from '../store/store.module';

@NgModule({
  declarations: [ElephantPageComponent],
  exports: [ElephantPageComponent],
  imports: [AnimalModule, CoreModule, StoreModule, CommonModule],
})
export class ElephantModule {}
