import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerComponent } from './spinner/spinner.component';
import { ErrorWellComponent } from './error-well/error-well.component';
import { AnimalListComponent } from './animal-list/animal-list.component';

@NgModule({
  declarations: [
    SpinnerComponent,
    ErrorWellComponent,
    AnimalListComponent,
  ],
  providers: [],
  imports: [ CommonModule ],
  exports: [
    SpinnerComponent,
    ErrorWellComponent,
    AnimalListComponent,
  ],
})
export class CoreModule {}
