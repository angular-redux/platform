import {
  async,
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

import {
  provideReduceForms,
  REDUX_FORM_DIRECTIVES,
} from './configure';

import { ConnectForm } from './connect';

import { logger } from './tests.utilities';

const createExample = (key: string, template: string) => {
  const component = Component({
    selector: `test-form-${key}`,
    template,
    directives: [
      FORM_DIRECTIVES,
      REDUX_FORM_DIRECTIVES,
    ],
  });

  const ctor = function() {
    this.example = new FormControl('');
  };

  return eval(`
    var klass = class ${key} {
      constructor() {
        ctor.apply(this, arguments);
      }
    };
    __decorate([component], klass);
  `);
};

interface AppState {
  fooState?: {
    example: string;
  };
}

const fooReducer = (state = {example: ''}, action = {type: ''}) => {
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
    provideForms(),
    provideReduceForms(store)
  ]);

  beforeEach(inject([TestComponentBuilder],
    (tcb: TestComponentBuilder) => builder = tcb));

  // const ConnectFormExample = createExample('formExample', `
  //   <form #form="ngForm" connect="fooState">
  //     <input type="text" ngControl="example" />
  //   </form>
  // `);

  // it('should bind a form control to application state',
  //   async(inject([], () =>
  //     builder.createAsync(ConnectFormExample).then((fixture: ComponentFixture<any>) => {
  //       fixture.detectChanges();

  //       debugger;

  //       console.log('element', fixture.debugElement.nativeElement);
  //   }))));

  const ConnectControlExample = createExample('controlExample', `
    <form connect="fooState">
      <input type="text" ngControl="example" />
    </form>
  `);

  it('should bind an input control to application state',
    async(inject([], () =>
      builder.createAsync(ConnectControlExample).then((fixture: ComponentFixture<any>) => {
        fixture.detectChanges();

        debugger;

        console.log('element connect', fixture.debugElement.nativeElement);
    }))));
});