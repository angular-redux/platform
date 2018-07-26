import { AfterContentInit, Input, OnDestroy } from '@angular/core';

import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  NgControl,
} from '@angular/forms';

import { Subscription } from 'rxjs';

import { Unsubscribe } from 'redux';

import { debounceTime } from 'rxjs/operators';

import { FormStore } from '../form-store';
import { State } from '../state';

export interface ControlPair {
  path: string[];
  control: AbstractControl;
}

export class ConnectBase implements OnDestroy, AfterContentInit {
  get path(): string[] {
    const path =
      typeof this.connect === 'function' ? this.connect() : this.connect;

    switch (typeof path) {
      case 'object':
        if (State.empty(path)) {
          return [];
        }
        if (Array.isArray(path)) {
          return path as string[];
        }
      case 'string':
        return (path as string).split(/\./g);
      default:
        // fallthrough above (no break)
        throw new Error(
          `Cannot determine path to object: ${JSON.stringify(path)}`,
        );
    }
  }
  @Input() connect?: () => (string | number) | (string | number)[];
  protected store?: FormStore;
  protected form: any;
  private stateSubscription?: Unsubscribe;

  private formSubscription?: Subscription;

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
        this.formSubscription = (this.form.valueChanges as any)
          .pipe(debounceTime(0))
          .subscribe((values: any) => this.publish(values));
      });
    });
  }

  private descendants(path: string[], formElement: any): ControlPair[] {
    const pairs = new Array<ControlPair>();

    if (formElement instanceof FormArray) {
      formElement.controls.forEach((c, index) => {
        for (const d of this.descendants((path as any).concat([index]), c)) {
          pairs.push(d);
        }
      });
    } else if (formElement instanceof FormGroup) {
      for (const k of Object.keys(formElement.controls)) {
        pairs.push({
          path: path.concat([k]),
          control: formElement.controls[k],
        });
      }
    } else if (
      formElement instanceof NgControl ||
      formElement instanceof FormControl
    ) {
      return [{ path, control: formElement as any }];
    } else {
      throw new Error(
        `Unknown type of form element: ${formElement.constructor.name}`,
      );
    }

    return pairs.filter(p => {
      const parent = (p.control as any)._parent;
      return parent === this.form.control || parent === this.form;
    });
  }

  private resetState() {
    const formElement =
      this.form.control === undefined ? this.form : this.form.control;

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
