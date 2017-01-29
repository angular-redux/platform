import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgReduxForms } from '@angular-redux/form';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';

@NgModule({
  declarations: [ FeedbackFormComponent ],
  providers: [ ],
  imports: [
    CommonModule,
    NgReduxForms,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [ FeedbackFormComponent ],
})
export class FeedbackModule {}
