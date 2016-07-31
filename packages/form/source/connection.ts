import {
  Directive,
  Inject,
  Input,
} from '@angular/core';
import {
  AbstractControl,
  NgForm,
  NgControl
} from '@angular/forms';

import {
  Iterable,
  Map as ImmutableMap
} from 'immutable';

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

  private ngOnChanges() {
    const state = this.getState();

    this.recursiveUpdate(state, this.form.controls);
  }

  private recursiveUpdate(state: RootState, controls: {[index: string]: AbstractControl}) {
    // NOTE(cbond): Turn this into an iterative loop not a recursive one

    // for (const key of Object.keys(this.form.controls)) {
    //   const control = this.form.controls[key];
    //   if (control) {
    //     control.value = this.seek(state, key);
    //     control.updateValueAndValidity({ onlySelf: false, emitEvent: true });
    //   }
    // }
  }

  private ngOnDestroy () {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  protected publish(values) {
    this.actions.valueChanged(this.connectTo, this.form, values);
  }

  protected getState(): RootState {
    return null;
  }

  protected seek(state: RootState | Iterable<string, any> | Map<string, any>, key: string[]) {
    let deepValue;
    for (const k of key) {
      if (Iterable.isIterable(state)) {
        const m = deepValue as ImmutableMap<string, any>;
        if (typeof m.get === 'function') {
           deepValue = m.get(k);
        }
        else {
          throw new Error(`Cannot retrieve value immutable nonassociative container: ${k}`);
        }
      }
      else if (state instanceof Map) {
        deepValue = state.get(k);
      }
      else {
        deepValue = state[k];
      }

      // If we were not able to find this state inside of our root state
      // structure, then we return undefined -- not null -- to indicate that
      // state. But this could be a perfectly normal use-case so we don't
      // want to throw an exception or anything along those lines.
      if (deepValue === undefined) {
        return undefined;
      }
    }

    return deepValue;
  }
}