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
  NgControl
} from '@angular/forms';

import { PromiseWrapper } from '@angular/common/src/facade/promise';

import {
  Iterable,
  Map as ImmutableMap
} from 'immutable';

import { Subscription } from 'rxjs';

import { FormActions } from './form-actions';

@Directive({
  selector: 'form[connect]',
  host: {
    '(valueChange)': 'publish($event.target.value)'
  },
})
export class Connection<RootState> {
  @Input('connect') public connectTo: string;

  private subscription: Subscription;

  constructor(
    @Query(NgControl) private children: QueryList<NgControl>,
    private actions: FormActions<RootState>,
    private form: NgForm
  ) {}

  private ngOnDestroy () {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  private ngAfterViewInit() {
    this.children.forEach(c => {
      const value = this.seek(this.getState(), this.path.concat([c.name]));

      this.form.updateModel(c, value);
    });

    PromiseWrapper.scheduleMicrotask(() => {
      this.subscription = this.form.valueChanges.subscribe(values => this.publish(values));
    });
  }

  private get path() {
    return typeof this.connectTo === 'string'
      ? this.connectTo.split(/\./)
      : [].concat(this.connectTo);
  }

  protected publish(values) {
    debugger;
    this.actions.valueChanged(this.connectTo, this.form, values);
  }

  protected getState(): RootState {
    return this.actions.getState();
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
          throw new Error(`Cannot retrieve value immutable nonassociative container: ${k}`);
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
