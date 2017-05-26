import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgReduxFormModule } from '@angular-redux/form';
import { FeedbackFormComponent } from './page';
import { StoreModule } from '../store/module';

@NgModule({
  declarations: [ FeedbackFormComponent ],
  providers: [ ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgReduxFormModule,
    StoreModule,
  ],
  exports: [ FeedbackFormComponent ],
})
export class FeedbackModule {}
