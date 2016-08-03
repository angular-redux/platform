import 'reflect-metadata';
import 'babel-polyfill';
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'ts-helpers';

import { provideRouter } from '@angular/router';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { Component, provide } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';

import { NgRedux } from 'ng2-redux';

import { combineReducers } from 'redux';

import {
  defaultFormReducer,
  provideReduceForms,
  Connection,
} from '../../source';

import { logger } from '../../source/tests.utilities';

@Component({
  selector: 'example',
  template: `
    <div>
      <form connect="form1">
        <input ngControl ngModel name="textExample" type="text" />
        <input ngControl ngModel name="checkboxExample" type="checkbox" />
        <select ngControl ngModel name="dropdownExample">
          <option value="one">One</option>
          <option value="two">Two</option>
          <option value="three">Three</option>
        </select>
      </form>
    </div>
  `,
  directives: [Connection]
})
export class Example {}

interface AppState {
  form1?: {
    textExample?: string;
    checkboxExample?: boolean;
    dropdownExample?: string;
  };
}

const form1 = {
  textExample: 'Text example',
  checkboxExample: true,
  dropdownExample: 'two'
};

const reducer = combineReducers({
  form1: defaultFormReducer(form1)
});

const ngRedux = new NgRedux<AppState>();

ngRedux.configureStore(reducer, {form1}, [logger], []);

bootstrap(Example, [
  provide(NgRedux, {useValue: ngRedux}),
  provideForms(),
  disableDeprecatedForms(),
  provideReduceForms(ngRedux)
]);
