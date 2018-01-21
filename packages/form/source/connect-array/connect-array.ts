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
  AsyncValidatorFn,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  NG_ASYNC_VALIDATORS,
  NG_VALIDATORS
} from '@angular/forms';
import {Unsubscribe} from 'redux';

import {ConnectBase} from '../connect';
import {FormStore} from '../form-store';
import {State} from '../state';
import {controlPath} from '../shims';

export class ConnectArrayTemplate {
  constructor(
    public $implicit: any,
    public index: number,
    public item: any
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

  private array = new FormArray([]);

  private key: string;

  constructor(
    @Optional() @Host() @SkipSelf() private parent: ControlContainer,
    @Optional() @Self() @Inject(NG_VALIDATORS) private rawValidators: any[],
    @Optional() @Self() @Inject(NG_ASYNC_VALIDATORS) private rawAsyncValidators: any[],
    private connection: ConnectBase,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private store: FormStore,
  ) {
    super();

    this.stateSubscription = this.store.subscribe(state => this.resetState(state));

    this.registerInternals(this.array);
  }

  @Input()
  set connectArrayOf(collection: any) {
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

  get validator(): ValidatorFn | null {
    return Validators.compose(this.rawValidators);
  }

  get asyncValidator(): AsyncValidatorFn | null {
    return Validators.composeAsync(this.rawAsyncValidators);
  }

  private get formArray(): FormArrayName {
    return <any> this;
  }

  updateValueAndValidity() {}

  ngOnDestroy() {
    this.viewContainerRef.clear();

    this.formDirective.form.removeControl(this.key);
    this.stateSubscription()
  }

  private resetState(state: any) {
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

  private registerInternals(array: any) {
    array.registerControl = () => {};
    array.registerOnChange = () => {};

    Object.defineProperties(this, {
      _rawValidators: {
        value: this.rawValidators || [],
      },
      _rawAsyncValidators: {
        value: this.rawAsyncValidators || [],
      },
    });
  }

  private patchDescendantControls(viewRef: any) {
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

  private transform(parent: FormGroup | FormArray, reference: any): AbstractControl {
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

    const iterate = (iterable: any): FormArray => {
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

    const associate = (value: any): FormGroup => {
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
