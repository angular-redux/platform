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

import { FormException } from './form-exception';
import { FormStore } from './form-store';
import { State } from './state';

@Directive({
  selector: 'form[connect]',
  host: {
    '(valueChange)': 'publish($event.target.value)'
  },
})
export class Connect<RootState> {
  @Input('connect') public statePath: string[] | string;

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

  private get path(): string[] {
    switch (typeof this.statePath) {
      case 'string':
        return (<string> this.statePath).split(/\./g);
      case 'object':
        if (State.empty(this.statePath)) {
          return [];
        }
        if (typeof this.statePath.length === 'number') {
          return <string[]> this.statePath;
        }
      default: // fallthrough above (no break)
        throw new Error(`Cannot determine path to object: ${JSON.stringify(this.statePath)}`);
    }
  }

  protected resetState() {
    this.children.forEach(c => {
      const value = State.get(this.getState(), this.path.concat([c.name]));

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
}
