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

import { Component, Input } from '@angular/core';

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

import { provideReduceForms } from './configure';
import { Connection } from './connection';

import { logger } from './tests.utilities';

const createControlFromTemplate = (key: string, template: string) => {
  @Component({
    selector: `test-form-${key}`,
    template,
    directives: [
      FORM_DIRECTIVES,
      Connection,
    ]
  })
  class TestForm {
    @Input() private element;
  }

  return TestForm;

  // return eval(`
  //   (function () {
  //     var klass = class ${key} {
  //       constructor() {}
  //     };
  //     return __decorate([component], klass);
  //   })()
  // `);
};

interface AppState {
  fooState?: {
    example: string;
  };
}

const fooReducer = (state = {example: 'Test!'}, action = {type: ''}) => {
  return state;
}

const reducers = combineReducers({
  fooState: fooReducer
});

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
    provideReduceForms(store),
  ]);

  beforeEach(inject([TestComponentBuilder],
    (tcb: TestComponentBuilder) => builder = tcb));

  const ConnectControlExample = createControlFromTemplate('controlExample', `
    <form ngForm connect="fooState">
      <input type="text" name="example" ngControl="example" ngModel />
    </form>
  `);

  it('should bind all form controls to application state',
    fakeAsync(inject([], () =>
      builder.createAsync(ConnectControlExample).then((fixture: ComponentFixture<any>) => {
        fixture.detectChanges();
        flushMicrotasks();

        const textbox = fixture.nativeElement.querySelector('input');

        expect(textbox.value).toEqual('Test!');
    }))));
});