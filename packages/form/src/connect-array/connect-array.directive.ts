import {
  Directive,
  EmbeddedViewRef,
  forwardRef,
  Host,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  SkipSelf,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NG_ASYNC_VALIDATORS,
  NG_VALIDATORS,
  NgModelGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Unsubscribe } from 'redux';

import { ConnectBase } from '../connect/connect-base';
import { FormStore } from '../form-store';
import { controlPath } from '../shims';
import { State } from '../state';
import { ConnectArrayTemplate } from './connect-array-template';

@Directive({
  selector: '[connectArray]',
  providers: [
    {
      provide: ControlContainer,
      useExisting: forwardRef(() => ConnectArrayDirective),
    },
  ],
})
export class ConnectArrayDirective extends ControlContainer
  implements OnInit, OnDestroy {
  private stateSubscription: Unsubscribe;

  private array = new FormArray([]);

  private key?: string;

  constructor(
    @Optional()
    @Host()
    @SkipSelf()
    private parent: ControlContainer,
    @Optional()
    @Self()
    @Inject(NG_VALIDATORS)
    private rawValidators: any[],
    @Optional()
    @Self()
    @Inject(NG_ASYNC_VALIDATORS)
    private rawAsyncValidators: any[],
    private connection: ConnectBase,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private store: FormStore,
  ) {
    super();

    this.stateSubscription = this.store.subscribe(state =>
      this.resetState(state),
    );

    this.registerInternals(this.array);
  }

  @Input()
  set connectArrayOf(collection: any) {
    this.key = collection;

    this.resetState(this.store.getState());
  }

  ngOnInit() {
    this.formDirective.addControl(this as any);
  }

  get name(): string {
    return this.key || '';
  }

  get control(): FormArray {
    return this.array;
  }

  get formDirective(): FormGroupDirective {
    return this.parent.formDirective as FormGroupDirective;
  }

  get path(): string[] {
    return this.key ? controlPath(this.key, this.parent) : [];
  }

  get validator(): ValidatorFn | null {
    return Validators.compose(this.rawValidators);
  }

  get asyncValidator(): AsyncValidatorFn | null {
    return Validators.composeAsync(this.rawAsyncValidators);
  }

  updateValueAndValidity() {
    // stub?
  }

  ngOnDestroy() {
    this.viewContainerRef.clear();

    if (this.key) {
      this.formDirective.form.removeControl(this.key);
    }

    this.stateSubscription();
  }

  private resetState(state: any) {
    if (this.key == null || this.key.length === 0) {
      return; // no state to retreive if no key is set
    }

    const iterable = State.get(state, this.connection.path.concat(this.path));

    let index = 0;

    for (const value of iterable) {
      const viewRef =
        this.viewContainerRef.length > index
          ? (this.viewContainerRef.get(index) as EmbeddedViewRef<
              ConnectArrayTemplate
            >)
          : null;

      if (viewRef == null) {
        const embeddedViewRef = this.viewContainerRef.createEmbeddedView<
          ConnectArrayTemplate
        >(
          this.templateRef,
          new ConnectArrayTemplate(index, index, value),
          index,
        );

        this.patchDescendantControls(embeddedViewRef);

        this.array.insert(
          index,
          this.transform(this.array, embeddedViewRef.context.item),
        );
      } else {
        Object.assign(
          viewRef.context,
          new ConnectArrayTemplate(index, index, value),
        );
      }

      ++index;
    }

    while (this.viewContainerRef.length > index) {
      this.viewContainerRef.remove(this.viewContainerRef.length - 1);
    }
  }

  private registerInternals(array: any) {
    array.registerControl = () => undefined;
    array.registerOnChange = () => undefined;

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
          value: () => undefined,
        },
      });
    });
  }

  private transform(
    parent: FormGroup | FormArray,
    reference: any,
  ): AbstractControl {
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
        const transformed = this.transform(array, value);
        if (transformed) {
          array.push(transformed);
        }
      }

      return array;
    };

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
      return iterate(reference as any[]);
    } else if (reference instanceof Set) {
      return iterate(reference as Set<any>);
    } else if (reference instanceof Map) {
      return associate(reference as Map<string, any>);
    } else if (reference instanceof Object) {
      return associate(reference);
    } else {
      throw new Error(
        `Cannot convert object of type ${typeof reference} / ${reference.toString()} to form element`,
      );
    }
  }
}
