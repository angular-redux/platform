import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AnimalModule } from '../animals/module';
import { CoreModule } from '../core/module';
import { StoreModule } from '../store/module';
import { ElephantPageComponent } from './page';

@NgModule({
  declarations: [ElephantPageComponent],
  exports: [ElephantPageComponent],
  imports: [AnimalModule, CoreModule, StoreModule, CommonModule],
})
export class ElephantModule {}
