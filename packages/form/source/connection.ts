import {
  Directive,
  Injectable,
  Input,
  Query,
  QueryList
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  NgForm,
  NgModel,
  NgControl
} from '@angular/forms';

import { PromiseWrapper } from '@angular/common/src/facade/promise';

import {
  Iterable,
  Map as ImmutableMap
} from 'immutable';

import { Subscription } from 'rxjs';

import { FormStore } from './form-store';

@Directive({
  selector: 'form[connect]',
  host: {
    '(valueChange)': 'publish($event.target.value)'
  },
})
export class Connection<RootState> {
  @Input('connect') public connectTo: string;

  private stateSubscription: Redux.Unsubscribe;

  private formSubscription: Subscription;

  constructor(
    @Query(NgControl) private children: QueryList<NgControl>,
    private store: FormStore<RootState>,
    private form: NgForm
  ) {
    this.stateSubscription = this.store.subscribe(state => {
      this.resetState();
    });
  }

  private ngOnDestroy () {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
      this.formSubscription = null;
    }
  }

  private ngAfterViewInit() {
    this.resetState();

    PromiseWrapper.scheduleMicrotask(() => {
      this.formSubscription = this.form.valueChanges.subscribe(values => this.publish(values));
    });
  }

  private get path() {
    return typeof this.connectTo === 'string'
      ? this.connectTo.split(/\./)
      : [].concat(this.connectTo);
  }

  protected resetState() {
    this.children.forEach(c => {
      const value = this.seek(this.getState(), this.path.concat([c.name]));

      const control = this.form.getControl(c as NgModel);
      if (control == null || control.value !== value) {
        this.form.updateModel(c, value);
      }
    });
  }

  protected publish(values) {
    this.store.valueChanged(this.path, this.form, values);
  }

  protected getState(): RootState {
    return this.store.getState();
  }

  protected seek(state: RootState | Iterable<string, any> | Map<string, any>, key: string[]): any {
    let deepValue = state;

    for (const k of key) {
      if (Iterable.isIterable(deepValue)) {
        const m = deepValue as ImmutableMap<string, any>;
        if (typeof m.get === 'function') {
           deepValue = m.get(k);
        }
        else {
          throw new Error(`Cannot retrieve value from immutable nonassociative container: ${k}`);
        }
      }
      else if (deepValue instanceof Map) {
        deepValue = (<Map<string, any>> deepValue).get(k);
      }
      else {
        deepValue = deepValue[k];
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
