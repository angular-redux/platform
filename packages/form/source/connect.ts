import {
  forwardRef,
  Directive,
  Injectable,
  Input,
  Query,
  QueryList,
  Optional,
  Self,
  Inject,
  ViewChildren,
  ContentChildren,
} from '@angular/core';
import {
  AbstractFormGroupDirective,
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupName,
  NgForm,
  NgModel,
  NgModelGroup,
  NgControl
} from '@angular/forms';

import {
  composeAsyncValidators,
  composeValidators,
  controlPath,
  setUpFormContainer
} from '@angular/forms/src/directives/shared';

import {
  NG_ASYNC_VALIDATORS,
  NG_VALIDATORS,
} from '@angular/forms/src/validators';

import { scheduleMicroTask } from '@angular/forms/src/facade/lang';

import { Subscription } from 'rxjs';

import { FormException } from './form-exception';
import { FormStore } from './form-store';
import { State } from './state';

@Directive({
  selector: 'form[connect]',
  // providers: [
  //   {
  //     provide: ControlContainer,
  //     useExisting: forwardRef(() => Connect)
  //   }
  // ]
})
export class Connect<RootState> {
  @Input('connect') connect: () => (string | string[]) | string | string[];

  private stateSubscription: Redux.Unsubscribe;

  private formSubscription: Subscription;

  constructor(
    @Query(NgControl, {descendants: true}) private children: QueryList<NgControl>,
    // @Optional() @Self() @Inject(NG_VALIDATORS) private validators: any[],
    // @Optional() @Self() @Inject(NG_ASYNC_VALIDATORS) private asyncValidators: any[],
    private store: FormStore<RootState>,
    private form: NgForm
  ) {
    // super(form, validators, asyncValidators);
    // super(form, [], []);

    this.stateSubscription = this.store.subscribe(state => {
      this.resetState();
    });

    // Object.defineProperty(form, 'path', {
    //     get: () => this.path,
    //     enumerable: true,
    //     configurable: true
    // });

    // const existingGet = (<any>form).get;

    // (<any>form).get = function (path: string[]) {
    //   return existingGet.call(this, path.slice(1));
    // };

    // const existingFind = (<any>form).find;

    // (<any>form).find = function (path: string[]) {
    //   return existingFind.call(this, path.slice(1));
    // };
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

    // super.ngOnDestroy();
  }

  private ngAfterViewInit() {
    this.resetState();

    scheduleMicroTask(() => {
      this.formSubscription = this.form.valueChanges.subscribe(values => this.publish(values));
    });
  }

  private ngAfterContentInit() {
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
