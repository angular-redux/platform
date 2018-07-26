import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CounterComponent } from './counter/component';
import { ErrorWellComponent } from './error-well/component';
import { SpinnerComponent } from './spinner/component';

@NgModule({
  declarations: [SpinnerComponent, ErrorWellComponent, CounterComponent],
  imports: [CommonModule],
  exports: [SpinnerComponent, ErrorWellComponent, CounterComponent],
})
export class CoreModule {}
