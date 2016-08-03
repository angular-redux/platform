import 'reflect-metadata';
import 'babel-polyfill';
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'ts-helpers';

import { provideRouter } from '@angular/router';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { Component, provide } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';

import { NgRedux, select } from 'ng2-redux';

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
      <h3>Form</h3>
      <form connect="form1">
        <input ngControl ngModel name="textExample" type="text" />
        <input ngControl ngModel name="checkboxExample" type="checkbox" />
        <select ngControl ngModel name="dropdownExample">
          <option value="one">One</option>
          <option value="two">Two</option>
          <option value="three">Three</option>
        </select>
      </form>
      <div>
        <h3>Redux state</h3>
        <div class="form-values">
          <strong>Text example:</strong>
          <div>{{textExample | async}}</div>
          <strong>Checkbox:</strong>
          <div>{{checkboxExample | async}}</div>
          <strong>Dropdown:</strong>
          <div>{{dropdownExample | async}}</div>
        </div>
      </div>
    </div>
  `,
  directives: [Connection],
  styles: [require('./index.css')]
})
export class Example {
  // These are just for reproducing the values inside the 'Form values' panel
  // and are not required to actually hook up the form. We are just pulling
  // the values back out of Redux to show them changing as the form changes.
  @select(s => s.form1.textExample) private textExample;
  @select(s => s.form1.checkboxExample) private checkboxExample;
  @select(s => s.form1.dropdownExample) private dropdownExample;
}

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
