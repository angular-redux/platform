import { Input } from '@angular/core';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormArray,
  NgControl,
} from '@angular/forms';

import { Subscription } from 'rxjs';

import { Unsubscribe } from 'redux';

import { debounceTime } 'rxjs/operators';

import { FormStore } from '../form-store';
import { State } from '../state';

export interface ControlPair {
  path: Array<string>;
  control: AbstractControl;
}

export class ConnectBase {

  @Input('connect') connect?: () => (string | number) | Array<string | number>;
  private stateSubscription?: Unsubscribe;

  private formSubscription?: Subscription;
  protected store?: FormStore;
  protected form: any;

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

  ngAfterContentInit() {
    Promise.resolve().then(() => {
      this.resetState();

      if (this.store) {
        this.stateSubscription = this.store.subscribe(() => this.resetState());
      }

      Promise.resolve().then(() => {
        this.formSubscription = (<any>this.form.valueChanges)
          .pipe(debounceTime(0))
          .subscribe((values: any) => this.publish(values));
      });
    });
  }

  private descendants(path: Array<string>, formElement: any): Array<ControlPair> {
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

    return pairs.filter(p => {
        const parent = (p.control as any)._parent;
        return parent === this.form.control || parent === this.form;
    });
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

      const value = State.get(this.getState(), this.path.concat(path));

      if (control.value !== value) {
        control.setValue(value);
      }
    });
  }

  private publish(value: any) {
    if (this.store) {
      this.store.valueChanged(this.path, this.form, value);
    }
  }

  private getState() {
    if (this.store) {
      return this.store.getState();
    }
  }
}
