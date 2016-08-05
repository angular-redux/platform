import {
  fakeAsync,
  flushMicrotasks,
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject,
  ComponentFixture,
  TestComponentBuilder,
} from '@angular/core/testing';
import {
  Component,
  Input,
  NgZone,
} from '@angular/core';
import {
  FORM_DIRECTIVES,
  disableDeprecatedForms,
  provideForms,
  FormControl,
  NgForm,
  FormGroup,
} from '@angular/forms';

import {
  Store,
  applyMiddleware,
  compose,
  combineReducers,
  createStore,
} from 'redux';

import { composeReducers } from './compose-reducers';
import { defaultFormReducer } from './form-reducer';

import { provideFormConnect } from './configure';
import { Connect } from './connect';

import {
  logger,
  simulateUserTyping,
} from './tests.utilities';

const createControlFromTemplate = (key: string, template: string) => {
  const component = Component({
    selector: `test-form-${key}`,
    template,
    directives: [
      FORM_DIRECTIVES,
      Connect,
    ]
  });

  return eval(`
    (function () {
      var klass = class ${key} {
        constructor() {}
      };
      return __decorate([component], klass);
    })()
  `);
};

interface AppState {
  fooState?: FooState;
}

interface FooState {
  example: string;
  deepInside: {
    foo: string;
  }
  bar: string;
  checkExample: boolean;
}

const initialState: FooState = {
  example: 'Test!',
  deepInside: {
    foo: 'Bar!'
  },
  bar: 'two',
  checkExample: true,
};

const testReducer = (state = initialState, action = {type: ''}) => {
  return state;
}

const reducers = composeReducers(
  combineReducers({
    fooState: testReducer
  }),
  defaultFormReducer());

describe('connect directive', () => {
  let builder: TestComponentBuilder;

  let store: Store<AppState>;
  beforeEach(() => {
    const create = compose(applyMiddleware(logger))(createStore);
    store = create(reducers, <AppState> {});
  });

  beforeEachProviders(() => [
    disableDeprecatedForms(),
    provideForms(),
    provideFormConnect(store),
  ]);

  beforeEach(inject([TestComponentBuilder],
    (tcb: TestComponentBuilder) => builder = tcb));

  const ConnectComponent = createControlFromTemplate('controlExample', `
    <form connect="fooState">
      <input type="text" name="example" ngControl ngModel />
    </form>
  `);

  it('should bind all form controls to application state',
    fakeAsync(inject([], () =>
      builder.createAsync(ConnectComponent).then((fixture: ComponentFixture<any>) => {
        fixture.detectChanges();

        flushMicrotasks();

        const textbox = fixture.nativeElement.querySelector('input');
        expect(textbox.value).toEqual('Test!');
    }))));

  const DeepConnectComponent = createControlFromTemplate('deepConnectExample', `
    <form connect="fooState.deepInside">
      <input type="text" name="foo" ngControl ngModel />
    </form>
  `);

  it('should bind a form control to element deep inside application state',
    fakeAsync(inject([], () =>
      builder.createAsync(DeepConnectComponent).then((fixture: ComponentFixture<any>) => {
        fixture.detectChanges();

        flushMicrotasks();

        const textbox = fixture.nativeElement.querySelector('input');
        expect(textbox.value).toEqual('Bar!');
    }))));

  const CheckboxForm = createControlFromTemplate('checkboxExample', `
    <form connect="fooState">
      <input type="checkbox" name="checkExample" ngControl ngModel />
    </form>
  `);

  it('should bind a checkbox to a boolean state',
    fakeAsync(inject([], () =>
      builder.createAsync(CheckboxForm).then((fixture: ComponentFixture<any>) => {
        fixture.detectChanges();

        flushMicrotasks();

        const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]');
        expect(checkbox.checked).toEqual(true);
    }))));

  const SelectForm = createControlFromTemplate('selectExample', `
    <form connect="fooState">
      <select name="bar" ngControl ngModel>
        <option value="none">None</option>
        <option value="one">One</option>
        <option value="two">Two</option>
      </select>
    </form>
  `);

  it('should bind a select dropdown to application state',
    fakeAsync(inject([], () =>
      builder.createAsync(SelectForm).then((fixture: ComponentFixture<any>) => {
        fixture.detectChanges();

        flushMicrotasks();

        const select = fixture.nativeElement.querySelector('select');
        expect(select.value).toEqual('two');

        // TODO(cbond): How to simulate a click-select sequence on this control?
        // Just updating `value' does not appear to invoke all of the Angular
        // change routines and therefore does not update Redux. But manually clicking
        // and selecting does. Need to find a way to simulate that sequence.
    }))));

  const UpdateTextValueExample = createControlFromTemplate('updateTextValue', `
    <form connect="fooState">
      <input type="text" name="bar" ngControl ngModel />
    </form>
  `);

  it('should update Redux state when the user changes the value of a control',
    fakeAsync(inject([], () =>
      builder.createAsync(UpdateTextValueExample).then((fixture: ComponentFixture<any>) => {
        fixture.detectChanges();

        flushMicrotasks();

        // validate initial data before we do the UI tests
        let state = store.getState();
        expect(state.fooState.bar).toEqual('two');

        const textbox = fixture.nativeElement.querySelector('input');
        expect(textbox.value).toEqual('two');

        return simulateUserTyping(textbox, 'abc')
          .then(() => {
            expect(textbox.value).toEqual('twoabc');

            state = store.getState();
            expect(state.fooState.bar).toEqual('twoabc');
          });
    }))));
});
