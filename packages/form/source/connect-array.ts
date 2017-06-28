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
  OnInit,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  AbstractControl,
  DefaultValueAccessor,
  FormArray,
  FormArrayName,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgModelGroup,
  ControlContainer,
  ControlValueAccessor,
} from '@angular/forms';

import {
  AsyncValidatorFn,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  NG_ASYNC_VALIDATORS,
  NG_VALIDATORS
} from '@angular/forms';
import {Unsubscribe} from 'redux';

import {Subscription} from 'rxjs';

import {ConnectBase} from './connect-base';
import {FormStore} from './form-store';
import {State} from './state';
import {controlPath, selectValueAccessor} from './shims';

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
export class ConnectArray extends ControlContainer implements OnInit {
  private stateSubscription: Unsubscribe;

  private formSubscription: Subscription;

  private array = new FormArray([]);

  private valueAccessor: ControlValueAccessor;

  private key: string;

  constructor(
    @Optional() @Host() @SkipSelf() private parent: ControlContainer,
    @Optional() @Self() @Inject(NG_VALIDATORS) private rawValidators: any[],
    @Optional() @Self() @Inject(NG_ASYNC_VALIDATORS) private rawAsyncValidators: any[],
    @Optional() @Self() @Inject(NG_VALUE_ACCESSOR) valueAccessors: any[],
    private connection: ConnectBase,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private store: FormStore,
  ) {
    super();

    this.stateSubscription = this.store.subscribe(state => this.resetState(state));

    this.valueAccessor = selectValueAccessor(<any> this, valueAccessors) || this.simpleAccessor();

    this.registerInternals(this.array);
  }

  @Input()
  set connectArrayOf(collection) {
    this.key = collection;

    this.resetState(this.store.getState());
  }

  ngOnInit() {
    this.formDirective.addControl(<any> this);
  }

  get name(): string {
    return this.key;
  }

  get control(): FormArray {
    return this.array;
  }

  get formDirective(): FormGroupDirective {
    return <FormGroupDirective>this.parent.formDirective;
  }

  get path(): Array<string> {
    return controlPath(this.key, this.parent);
  }

  get validator(): ValidatorFn {
    return Validators.compose(this.rawValidators);
  }

  get asyncValidator(): AsyncValidatorFn {
    return Validators.composeAsync(this.rawAsyncValidators);
  }

  private get formArray(): FormArrayName {
    return <any> this;
  }

  updateValueAndValidity() {}

  ngOnDestroy() {
    this.viewContainerRef.clear();

    this.formDirective.form.removeControl(this.key);
  }

  private resetState(state) {
    if (this.key == null || this.key.length === 0) {
      return; // no state to retreive if no key is set
    }

    const iterable = State.get(state, this.connection.path.concat(this.path));

    let index = 0;

    for (const value of iterable) {
      var viewRef = this.viewContainerRef.length > index
        ? <EmbeddedViewRef<ConnectArrayTemplate>>this.viewContainerRef.get(index)
        : null;

      if (viewRef == null) {
        const viewRef = this.viewContainerRef.createEmbeddedView<ConnectArrayTemplate>(
            this.templateRef,
            new ConnectArrayTemplate(
              index,
              index,
              value),
            index);

        this.patchDescendantControls(viewRef);

        this.array.insert(index, this.transform(this.array, viewRef.context.item));
      }
      else {
        Object.assign(viewRef.context,
          new ConnectArrayTemplate(
            index,
            index,
            value));
      }

      ++index;
    };

    while (this.viewContainerRef.length > index) {
      this.viewContainerRef.remove(this.viewContainerRef.length - 1);
    }
  }

  private registerInternals(array) {
    array.registerControl = c => {};
    array.registerOnChange = fn => {};

    Object.defineProperties(this, {
      _rawValidators: {
        value: this.rawValidators || [],
      },
      _rawAsyncValidators: {
        value: this.rawAsyncValidators || [],
      },
    });
  }

  private patchDescendantControls(viewRef) {
    const groups = Object.keys(viewRef._view)
      .map(k => viewRef._view[k])
      .filter(c => c instanceof NgModelGroup);

    groups.forEach(c => {
      Object.defineProperties(c, {
        _parent: {
          value: this,
        },
        _checkParentType: {
          value: () => {},
        },
      });
    });
  }

  private transform(parent: FormGroup | FormArray, reference): AbstractControl {
    const emptyControl = () => {
      const control = new FormControl(null);
      control.setParent(parent);
      return control;
    };

    if (reference == null) {
      return emptyControl();
    }

    if (typeof reference.toJS === 'function') {
      reference = reference.toJS();
    }

    switch (typeof reference) {
      case 'string':
      case 'number':
      case 'boolean':
        return emptyControl();
    }

    const iterate = (iterable): FormArray => {
      const array = new FormArray([]);

      this.registerInternals(array);

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

  private simpleAccessor() {
    return {
      writeValue: value => this.control.setValue(value),
      registerOnChange(fn) {},
      registerOnTouched(fn) {}
    };
  }
}
