import {
  ComponentFixtureNoNgZone,
  TestBed,
  fakeAsync,
  flushMicrotasks,
  inject,
  tick,
} from '@angular/core/testing';
import {
  Component,
  Input,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
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

import {composeReducers} from './compose-reducers';
import {defaultFormReducer} from './form-reducer';
import {provideReduxForms} from './configure';
import {NgReduxFormModule} from './module';

import {
  logger,
  simulateUserTyping,
} from './tests.utilities';

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

@Component({
  selector: 'test-component-1',
  template: `
    <form connect="fooState">
      <input type="text" name="example" ngControl ngModel />
    </form>
  `,
})
export class BasicUsageComponent {}

@Component({
  selector: 'test-component-2',
  template: `
    <form connect="fooState.deepInside">
      <input type="text" name="foo" ngControl ngModel />
    </form>
  `,
})
export class DeepConnectComponent {}

@Component({
  selector: 'test-component-3',
  template: `
    <form connect="fooState">
      <input type="checkbox" name="checkExample" ngControl ngModel />
    </form>
  `,
})
export class CheckboxComponent {}

@Component({
  selector: 'test-component-4',
  template: `
    <form connect="fooState">
      <select name="bar" ngControl ngModel>
        <option value="none">None</option>
        <option value="one">One</option>
        <option value="two">Two</option>
      </select>
    </form>
  `,
})
export class SelectComponent {}

@Component({
  selector: 'test-component-5',
  template: `
    <form connect="fooState">
      <input type="text" name="bar" ngControl ngModel />
    </form>
  `
})
export class UpdateTextComponent {}

describe('connect directive', () => {
  let store: Store<AppState>;

  beforeEach(done => {
    const create = compose(applyMiddleware(logger))(createStore);

    store = create(reducers, <AppState> {});

    TestBed.configureCompiler({
      providers: [
        {provide: ComponentFixtureNoNgZone, useValue: true},
      ]
    });

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgReduxFormModule,
      ],
      declarations: [
        BasicUsageComponent,
        DeepConnectComponent,
        CheckboxComponent,
        SelectComponent,
        UpdateTextComponent,
      ],
      providers: [
        provideReduxForms(store),
      ]
    });

    TestBed.compileComponents().then(() => done());
  });

  it('should bind all form controls to application state',
    fakeAsync(inject([], () => {
      const fixture = TestBed.createComponent(BasicUsageComponent);
      fixture.detectChanges();

      tick();
      flushMicrotasks();

      const textbox = fixture.nativeElement.querySelector('input');
      expect(textbox.value).toEqual('Test!');
    })));

  it('should bind a form control to element deep inside application state',
    () => {
      return fakeAsync(inject([], () => {
        const fixture = TestBed.createComponent(DeepConnectComponent);
        fixture.detectChanges();

        tick();
        flushMicrotasks();

        const textbox = fixture.nativeElement.querySelector('input');
        expect(textbox.value).toEqual('Bar!');
      }));
    });

  it('should bind a checkbox to a boolean state',
    fakeAsync(inject([], () => {
      const fixture = TestBed.createComponent(CheckboxComponent);
      fixture.detectChanges();

      tick();
      flushMicrotasks();

      const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]');
      expect(checkbox.checked).toEqual(true);
    })));

  it('should bind a select dropdown to application state',
    fakeAsync(inject([], () => {
      const fixture = TestBed.createComponent(SelectComponent);
      fixture.detectChanges();

      tick();
      flushMicrotasks();

      const select = fixture.nativeElement.querySelector('select');
      expect(select.value).toEqual('two');

      // TODO(cbond): How to simulate a click-select sequence on this control?
      // Just updating `value' does not appear to invoke all of the Angular
      // change routines and therefore does not update Redux. But manually clicking
      // and selecting does. Need to find a way to simulate that sequence.
    })));

  it('should update Redux state when the user changes the value of a control',
    fakeAsync(inject([], () => {
      const fixture = TestBed.createComponent(UpdateTextComponent);
      fixture.detectChanges();

      tick();
      flushMicrotasks();

      // validate initial data before we do the UI tests
      let state = store.getState();
      expect(state.fooState.bar).toEqual('two');

      const textbox = fixture.nativeElement.querySelector('input');
      expect(textbox.value).toEqual('two');

      return simulateUserTyping(textbox, 'abc')
        .then(() => {
          tick();
          flushMicrotasks();

          expect(textbox.value).toEqual('twoabc');

          state = store.getState();
          expect(state.fooState.bar).toEqual('twoabc');
        });
    })));
});
