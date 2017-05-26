import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElephantPageComponent } from './page';
import { AnimalModule } from '../animals/module';
import { CoreModule } from '../core/module';
import { StoreModule } from '../store/module';

@NgModule({
  declarations: [ElephantPageComponent],
  exports: [ElephantPageComponent],
  imports: [AnimalModule, CoreModule, StoreModule, CommonModule],
})
export class ElephantModule {}
