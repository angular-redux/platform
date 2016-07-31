import { Directive, Inject, Input, SimpleChanges } from '@angular/core';
import { NgForm, NgControl } from '@angular/forms';

import { Subscription } from 'rxjs';

import { FormActions } from './form-actions';

@Directive({
  selector: 'form[connect]',
})
export class Connection<RootState> {
  @Input('connect') private connectTo: string;

  private subscription: Subscription;

  constructor(
    @Inject(FormActions) private actions: FormActions<RootState>,
    @Inject(NgForm) private form: NgForm
  ) {
    this.subscription = this.form.valueChanges.subscribe(values => this.publish(values));
  }

  private ngOnDestroy () {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  protected publish(values) {
    this.actions.valueChanged(this.form, this.connectTo, values);
  }
}