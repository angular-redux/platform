import {
  Directive,
  Input,
} from '@angular/core';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormArray,
  NgForm,
  NgModel,
  NgControl,
} from '@angular/forms';

import {scheduleMicroTask} from '@angular/forms/src/facade/lang';

import {Subscription} from 'rxjs';

import 'rxjs/add/operator/debounceTime';

import {FormException} from './form-exception';
import {FormStore} from './form-store';
import {State} from './state';

export interface ControlPair {
  path: string[];
  control: AbstractControl;
}

@Directive({
  selector: 'form[connect]',
})
export class Connect<RootState> {
  @Input('connect') connect: () => (string | string[]) | string | string[];

  private stateSubscription: Redux.Unsubscribe;

  private formSubscription: Subscription;

  constructor(
    private store: FormStore<RootState>,
    private form: NgForm
  ) {}

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
    scheduleMicroTask(() => {
      this.resetState();

      this.stateSubscription = this.store.subscribe(state => {
        this.resetState();
      });

      setImmediate(() => {
        this.formSubscription = this.form.valueChanges.debounceTime(0).subscribe(values => this.publish(values));
      });
    });
  }

  protected descendants(path: string[], formElement): Array<ControlPair> {
    const pairs = new Array<ControlPair>();

    if (formElement instanceof FormArray) {
      formElement.controls.forEach((c, index) => {
        for (const d of this.descendants(path.concat([index]), c)) {
          pairs.push(d);
        }
      })
    }
    else if (formElement instanceof FormGroup) {
      for (const k of Object.keys(formElement.controls)) {
        for (const d of this.descendants(path.concat([k]), formElement.controls[k])) {
          pairs.push(d);
        }
      }
    }
    else if (formElement instanceof NgControl || formElement instanceof FormControl) {
      return [{path: path, control: formElement}];
    }
    else {
      throw new Error(`Unknown type of form element: ${formElement.constructor.name}`);
    }

    return pairs;
  }

  protected resetState() {
    const children = this.descendants([], this.form.control);

    children.forEach(c => {
      const {path, control} = c;

      const value = State.get(this.getState(), this.path.concat(c.path));

      if (control.value !== value) {
        const phonyControl = <any>{path: path};

        this.form.updateModel(phonyControl, value);
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
