import 'reflect-metadata';
import 'babel-polyfill';
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'ts-helpers';

import { provideRouter } from '@angular/router';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { Component, provide } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';

import { Map, fromJS } from 'immutable';

import { NgRedux, select } from 'ng2-redux';

import { combineReducers } from 'redux';

import {
  composeReducers,
  defaultFormReducer,
  provideReduceForms,
  Connection,
} from '../../source';

import { logger } from '../../source/tests.utilities';

@Component({
  selector: 'form-example',
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
export class FormExample {
  // These are just for reproducing the values inside the 'Form values' panel
  // and are not required to actually hook up the form. We are just pulling
  // the values back out of Redux to show them changing as the form changes.
  @select(s => s.form1.textExample) private textExample;
  @select(s => s.form1.checkboxExample) private checkboxExample;
  @select(s => s.form1.dropdownExample) private dropdownExample;
}

@Component({
  selector: 'todo-example',
  template: `
    <h3>Todos</h3>
    <form connect="todos">
      <input type="text" name="name" ngControl ngModel />
    </form>
    <button type="button" (click)="onAddItem()">Add</button>
    <ul>
      <li *ngFor="let item of (list | async); let index = index">
        {{item}}
        <button type="button" (click)="onRemoveItem(index)">Remove</button>
      </li>
    </ul>
  `,
  directives: [Connection]
})
export class TodoExample {
  @select(s => s.todos.get('list')) private list;

  constructor(private ngRedux: NgRedux<AppState>) {}

  private onAddItem() {
    this.ngRedux.dispatch({ type: 'ADD_TODO' });
  }

  private onRemoveItem(index: number) {
    if (index == null) {
      return;
    }
    this.ngRedux.dispatch({ type: 'REMOVE_TODO', payload: { index }});
  }
}

@Component({
  selector: 'example',
  template: `
    <div>
      <form-example></form-example>
    </div>
    <div>
      <todo-example></todo-example>
    </div>
  `,
  directives: [FormExample, TodoExample]
})
export class Example {}

interface AppState {
  form1?: {
    textExample?: string;
    checkboxExample?: boolean;
    dropdownExample?: string;
  };
  todos?: Map<string, any>;
}

const form1 = {
  textExample: 'Text example',
  checkboxExample: true,
  dropdownExample: 'two'
};

const todos = fromJS({ // immutablejs structure
  name: 'Get groceries!',
  list: [
    'Pick the kids up from school',
    'Do the laundry'
  ]
});

const reducer = composeReducers(
  combineReducers({
    form1: formReducer,
    todos: todoReducer
  }),
  defaultFormReducer());

function formReducer(state = form1, action: {type: string, payload?}) {
  return state;
}

function todoReducer(state = todos, action: {type: string, payload?}) {
  switch (action.type) {
    case 'ADD_TODO':
      const name = state.get('name').trim();
      if (name) {
        return state.merge({
          list: state.get('list').concat([name]),
          name: ''
        });
      }
      break;
    case 'REMOVE_TODO':
      return state.deleteIn(['list', action.payload.index]);
  }
  return state;
}

const ngRedux = new NgRedux<AppState>();

ngRedux.configureStore(reducer, {form1, todos}, [logger], []);

bootstrap(Example, [
  provide(NgRedux, {useValue: ngRedux}),
  provideForms(),
  disableDeprecatedForms(),
  provideReduceForms(ngRedux)
]);
