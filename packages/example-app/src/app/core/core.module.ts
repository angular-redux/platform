import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerComponent } from './spinner/spinner.component';
import { ErrorWellComponent } from './error-well/error-well.component';

@NgModule({
  declarations: [
    SpinnerComponent,
    ErrorWellComponent,
  ],
  imports: [ CommonModule ],
  exports: [
    SpinnerComponent,
    ErrorWellComponent,
  ],
})
export class CoreModule {}
