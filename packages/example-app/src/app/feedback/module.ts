import { NgReduxFormModule } from '@angular-redux/form';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '../store/module';
import { FeedbackFormComponent } from './page';

@NgModule({
  declarations: [FeedbackFormComponent],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgReduxFormModule,
    StoreModule,
  ],
  exports: [FeedbackFormComponent],
})
export class FeedbackModule {}
