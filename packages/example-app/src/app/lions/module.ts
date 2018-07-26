import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AnimalModule } from '../animals/module';
import { CoreModule } from '../core/module';
import { StoreModule } from '../store/module';
import { LionPageComponent } from './page';

@NgModule({
  declarations: [LionPageComponent],
  exports: [LionPageComponent],
  imports: [AnimalModule, CoreModule, StoreModule, CommonModule],
})
export class LionModule {}
