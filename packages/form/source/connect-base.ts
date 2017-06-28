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
  NgControl,
} from '@angular/forms';

import { Subscription } from 'rxjs';

import { Unsubscribe } from 'redux';

import 'rxjs/add/operator/debounceTime';

import { FormException } from './form-exception';
import { FormStore } from './form-store';
import { State } from './state';

export interface ControlPair {
  path: Array<string>;
  control: AbstractControl;
}

export class ConnectBase {

  @Input('connect') connect: () => (string | number) | Array<string | number>;
  private stateSubscription: Unsubscribe;

  private formSubscription: Subscription;
  protected store: FormStore;
  protected form;

  public get path(): Array<string> {
    const path = typeof this.connect === 'function'
      ? this.connect()
      : this.connect;

    switch (typeof path) {
      case 'object':
        if (State.empty(path)) {
          return [];
        }
        if (Array.isArray(path)) {
          return <Array<string>>path;
        }
      case 'string':
        return (<string>path).split(/\./g);
      default: // fallthrough above (no break)
        throw new Error(`Cannot determine path to object: ${JSON.stringify(path)}`);
    }
  }

  ngOnDestroy() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }

    if (typeof this.stateSubscription === 'function') {
      this.stateSubscription(); // unsubscribe
    }
  }

  private ngAfterContentInit() {
    Promise.resolve().then(() => {
      this.resetState();

      this.stateSubscription = this.store.subscribe(state => {
        this.resetState();
      });

      Promise.resolve().then(() => {
        this.formSubscription = (<any>this.form.valueChanges).debounceTime(0).subscribe(values => this.publish(values));
      });
    });
  }

  private descendants(path: Array<string>, formElement): Array<ControlPair> {
    const pairs = new Array<ControlPair>();

    if (formElement instanceof FormArray) {
      formElement.controls.forEach((c, index) => {
        for (const d of this.descendants((<any>path).concat([index]), c)) {
          pairs.push(d);
        }
      })
    }
    else if (formElement instanceof FormGroup) {
      for (const k of Object.keys(formElement.controls)) {
        pairs.push({ path: path.concat([k]), control: formElement.controls[k] });
      }
    }
    else if (formElement instanceof NgControl || formElement instanceof FormControl) {
      return [{ path: path, control: <any>formElement }];
    }
    else {
      throw new Error(`Unknown type of form element: ${formElement.constructor.name}`);
    }

    return pairs.filter(p => (<any>p.control)._parent === this.form.control);
  }

  private resetState() {
    var formElement;
    if (this.form.control === undefined) {
      formElement = this.form;
    }
    else {
      formElement = this.form.control;
    }

    const children = this.descendants([], formElement);

    children.forEach(c => {
      const { path, control } = c;

      const value = State.get(this.getState(), this.path.concat(c.path));

      if (control.value !== value) {
        const phonyControl = <any>{ path: path };

        this.form.updateModel(phonyControl, value);
      }
    });
  }

  private publish(value) {
    this.store.valueChanged(this.path, this.form, value);
  }

  private getState() {
    return this.store.getState();
  }
}
