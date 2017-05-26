import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerComponent } from './spinner/component';
import { ErrorWellComponent } from './error-well/component';
import { CounterComponent } from './counter/component';

@NgModule({
  declarations: [
    SpinnerComponent,
    ErrorWellComponent,
    CounterComponent,
  ],
  imports: [ CommonModule ],
  exports: [
    SpinnerComponent,
    ErrorWellComponent,
    CounterComponent,
  ],
})
export class CoreModule {}
