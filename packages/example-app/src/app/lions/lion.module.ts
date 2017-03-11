import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LionPageComponent } from './lion-page.container';
import { AnimalModule } from '../animals/animal.module';
import { CoreModule } from '../core/core.module';
import { StoreModule } from '../store/store.module';

@NgModule({
  declarations: [LionPageComponent],
  exports: [LionPageComponent],
  imports: [AnimalModule, CoreModule, StoreModule, CommonModule],
})
export class LionModule {}
