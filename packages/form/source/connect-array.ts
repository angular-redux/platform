import {
  forwardRef,
  Host,
  Input,
  SkipSelf,
  Self,
  Inject,
  TemplateRef,
  ViewContainerRef,
  Directive,
  Optional,
  EmbeddedViewRef,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormArrayName,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgModelGroup,
  ControlContainer,
} from '@angular/forms';
import {
  composeAsyncValidators,
  composeValidators,
  controlPath,
  setUpFormContainer
} from '@angular/forms/src/directives/shared';
import {
  AsyncValidatorFn,
  ValidatorFn
} from '@angular/forms/src/directives/validators';
import {
  NG_ASYNC_VALIDATORS,
  NG_VALIDATORS
} from '@angular/forms/src/validators';

import { Subscription } from 'rxjs';

import { Connect } from './connect';
import { FormStore } from './form-store';
import { State } from './state';

export class ConnectArrayTemplate {
  constructor(
    public $implicit,
    public index: number,
    public item
  ) {}
}

@Directive({
  selector: '[connectArray]',
  providers: [{
    provide: ControlContainer,
    useExisting: forwardRef(() => ConnectArray)
  }]
})
export class ConnectArray<RootState> extends ControlContainer {
  private stateSubscription: Redux.Unsubscribe;

  private formSubscription: Subscription;

  private array = new FormArray([]);

  private key: string;

  constructor(
    @Optional() @Host() @SkipSelf() private parent: ControlContainer,
    @Optional() @Self() @Inject(NG_VALIDATORS) private validators: any[],
    @Optional() @Self() @Inject(NG_ASYNC_VALIDATORS) private asyncValidators: any[],
    private connection: Connect<RootState>,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private store: FormStore<RootState>
  ) {
    super();

    this.stateSubscription = this.store.subscribe(state => this.resetState(state));

    (<any>this).array.registerControl = () => {}
  }

  updateValueAndValidity() {}

  ngOnInit() {
    this.formDirective.form.addControl(this.key, this.array);

    const ctrl = this.formDirective.form.find(this.path);
    setUpFormContainer(<any> ctrl, this.formArray);

    ctrl.updateValueAndValidity({
      emitEvent: false
    });
  }

  private get formArray(): FormArrayName {
    return <any> this;
  }

  ngOnDestroy() {
    this.viewContainerRef.clear();

    this.formDirective.form.removeControl(this.key);
  }

  get control(): FormArray {
    return this.formDirective.getFormArray(this.formArray);
  }

  get formDirective(): FormGroupDirective {
    return <FormGroupDirective>this.parent.formDirective;
  }

  get path(): string[] {
    return controlPath(this.key, this.parent);
  }

  get validator(): ValidatorFn {
    return composeValidators(this.validators);
  }

  get asyncValidator(): AsyncValidatorFn {
    return composeAsyncValidators(this.asyncValidators);
  }

  @Input()
  set connectArrayOf(collection) {
    this.key = collection;

    this.resetState(this.store.getState());
  }


  private resetState(state: RootState) {
    if (this.key == null || this.key.length === 0) {
      return; // no state to retreive if no key is set
    }

    const iterable: Iterable<any> = State.get(state, this.connection.path.concat(this.path));

    let index = 0;
    for (const iterableValue of iterable) {
      var viewRef = this.viewContainerRef.length > index
        ? <EmbeddedViewRef<ConnectArrayTemplate>>this.viewContainerRef.get(index)
        : null;

      if (viewRef == null) {
        const viewRef = this.viewContainerRef.createEmbeddedView<ConnectArrayTemplate>(
            this.templateRef,
            new ConnectArrayTemplate(
              index,
              index,
              iterableValue),
            index);

        this.patchDescendantControls(viewRef);

        this.array.insert(index, this.transform(this.array, viewRef.context.item));
      }
      else {
        Object.assign(viewRef.context,
          new ConnectArrayTemplate(
            index,
            index,
            iterableValue));
      }

      ++index;
    }

    while (this.viewContainerRef.length > index) {
      this.viewContainerRef.remove(this.viewContainerRef.length - 1);
    }
  }

  private patchDescendantControls(viewRef) {
    const groups = Object.keys(viewRef._view)
      .map(k => viewRef._view[k])
      .filter(c => c instanceof NgModelGroup);

    groups.forEach((c: any) => {
      c._parent = this;
      c._checkParentType = function () {};
    });
  }

  private transform(parent: FormGroup | FormArray, reference): AbstractControl {
    if (reference == null) {
      return null;
    }

    if (typeof reference.toJS === 'function') {
      reference = reference.toJS();
    }

    switch (typeof reference) {
      case 'string':
      case 'number':
      case 'boolean':
        const control = new FormControl(null);
        control.setParent(parent);
        return control;
    }

    const iterate = <T>(iterable: Iterable<T>): FormArray => {
      const array = new FormArray([]);

      array.setParent(parent);

      for (let i = array.length; i > 0; i--) {
        array.removeAt(i);
      }

      for (const value of iterable) {
        const transformed = this.transform(array, value)
        if (transformed) {
          array.push(transformed);
        }
      }

      return array;
    }

    const associate = <T>(value): FormGroup => {
      const group = new FormGroup({});
      group.setParent(parent);

      for (const key of Object.keys(value)) {
        const transformed = this.transform(group, value[key]);
        if (transformed) {
          group.addControl(key, transformed);
        }
      }

      return group;
    };

    if (Array.isArray(reference)) {
      return iterate(<Array<any>> reference);
    }
    else if (reference instanceof Set) {
      return iterate(<Set<any>> reference);
    }
    else if (reference instanceof Map) {
      return associate(<Map<string, any>> reference);
    }
    else if (reference instanceof Object) {
      return associate(reference);
    }
    else {
      throw new Error(
        `Cannot convert object of type ${typeof reference} / ${reference.toString()} to form element`);
    }
  }
}
