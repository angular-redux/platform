import {
  Directive,
  Input,
  Query,
  QueryList,
} from '@angular/core';
import {
  NgForm,
  NgModel,
  NgControl,
} from '@angular/forms';
import {
  scheduleMicroTask,
} from '@angular/forms/src/facade/lang';

import { Subscription } from 'rxjs';

import { FormException } from './form-exception';
import { FormStore } from './form-store';
import { State } from './state';

@Directive({
  selector: 'form[connect]',
})
export class Connect<RootState> {
  @Input('connect') connect: () => (string | string[]) | string | string[];

  private stateSubscription: Redux.Unsubscribe;

  private formSubscription: Subscription;

  constructor(
    @Query(NgControl, {descendants: true}) private children: QueryList<NgControl>,
    private store: FormStore<RootState>,
    private form: NgForm
  ) {
    this.stateSubscription = this.store.subscribe(state => {
      this.resetState();
    });
  }

  get _parent() {
    return this.form;
  }

  public get path(): string[] {
    const path = typeof this.connect === 'function'
      ? this.connect()
      : this.connect;

    switch (typeof path) {
      case 'object':
        if (State.empty(path)) {
          return [];
        }
        if (typeof path.length === 'number') {
          return <string[]> path;
        }
      case 'string':
        return (<string> path).split(/\./g);
      default: // fallthrough above (no break)
        throw new Error(`Cannot determine path to object: ${JSON.stringify(path)}`);
    }
  }

  ngOnDestroy () {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
      this.formSubscription = null;
    }
  }

  private ngAfterViewInit() {
    this.resetState();

    scheduleMicroTask(() => {
      this.formSubscription = this.form.valueChanges.subscribe(values => this.publish(values));
    });
  }

  protected resetState() {
    this.children.forEach(c => {
      const value = State.get(this.getState(), this.path.concat(c.path));

      const control = this.form.getControl(c as NgModel);

      if (control == null || control.value !== value) {
        this.form.updateModel(c, value);
      }
    });
  }

  protected publish(value) {
    this.store.valueChanged(this.path, this.form, value);
  }

  protected getState(): RootState {
    return this.store.getState();
  }
}
