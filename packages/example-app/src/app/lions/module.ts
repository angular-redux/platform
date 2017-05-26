import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LionPageComponent } from './page';
import { AnimalModule } from '../animals/module';
import { CoreModule } from '../core/module';
import { StoreModule } from '../store/module';

@NgModule({
  declarations: [LionPageComponent],
  exports: [LionPageComponent],
  imports: [AnimalModule, CoreModule, StoreModule, CommonModule],
})
export class LionModule {}
