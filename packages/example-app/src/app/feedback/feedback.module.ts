import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgReduxFormModule } from '@angular-redux/form';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';
import { StoreModule } from '../store/store.module';

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
