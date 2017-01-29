import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {Component, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {Map, fromJS} from 'immutable';

import {NgRedux, select} from '@angular-redux/store';

import {combineReducers} from 'redux';

import {
  Connect,
  ConnectArray,
  FormStore,
  NgReduxFormModule,
  composeReducers,
  defaultFormReducer,
} from '../../source';

import {logger} from '../../source/tests.utilities';

@Component({
  selector: 'form-example',
  template: `
    <div>
      <h3>Form</h3>
      <form connect="form1">
        <input ngControl ngModel name="textExample" type="text" />
        <input ngControl ngModel name="checkboxExample" type="checkbox" />
        <template connectArray let-index connectArrayOf="arrayExample">
          <div [ngModelGroup]="index">
            <input ngControl ngModel name="numberExample" type="number" />
            <select ngControl ngModel name="dropdownExample">
              <option value="one">One</option>
              <option value="two">Two</option>
              <option value="three">Three</option>
            </select>
            <!-- Nested array -->
            <template connectArray let-innerIndex="index" connectArrayOf="cities">
              <div [ngModelGroup]="innerIndex">
                <input ngControl ngModel name="name" type="string" placeholder='City' />
              </div>
            </template>
          </div>
        </template>
        <button (click)="addRow()">Add</button>
      </form>

      <div>
        <h3>Redux state</h3>
        <div class="form-values">
          <div>
            Text example
            <span>{{textExample | async}}</span>
          </div>
          <div>
            Checkbox
            <span>{{checkboxExample | async}}</span>
          </div>
          <div class="arrays">
            <div *ngFor="let item of (arrayExample | async)">
              <div>
                Number
                <span>{{item.numberExample}}</span>
              </div>
              <div>
                Dropdown
                <span>{{item.dropdownExample}}</span>
              </div>
              <div class="arrays">
                Cities:
                <div *ngFor="let city of (item.cities)">
                  <span>{{city.name}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./index.css']
})
export class FormExample {
  // These are just for reproducing the values inside the 'Form values' panel
  // and are not required to actually hook up the form. We are just pulling
  // the values back out of Redux to show them changing as the form changes.
  @select(s => s.form1.textExample) private textExample;
  @select(s => s.form1.checkboxExample) private checkboxExample;
  @select(s => s.form1.arrayExample) private arrayExample;

  constructor(private ngRedux: NgRedux<AppState>) {}

  addRow() {
    this.ngRedux.dispatch({
      type: 'ADD_FORM_ENTRY'
    });
  }
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
    <form-example></form-example>
    <todo-example></todo-example>
  `,
})
export class Example {
  constructor(private ngRedux: NgRedux<AppState>) {
    ngRedux.configureStore(reducer, {form1, todos}, [logger], []);
  }
}

export interface AppState {
  form1?: {
    textExample?: string;
    checkboxExample?: boolean;
    arrayExample?: {
      numberExample?: number,
      dropdownExample?: string;
      cities: {
        name: string
      }[]
    }[]
  };
  todos?: Map<string, any>;
}

const form1 = {
  textExample: 'Text example',
  checkboxExample: true,
  arrayExample: [
    {
      numberExample: 1,
      dropdownExample: 'one',
      cities: [{name: 'Detroit'},{name: 'Pittsburgh'}]
    },
    {
      numberExample: 2,
      dropdownExample: 'two',
      cities: [{name: 'Chicago'}, {name: 'New York'}]
    }
  ]
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
  if (action.type === 'ADD_FORM_ENTRY') {
    state.arrayExample.push({
      numberExample: null,
      dropdownExample: null,
      cities:[{name: ''}]
    });
  }
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

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgReduxFormModule,
  ],
  declarations: [
    FormExample,
    TodoExample,
    Example,
  ],
  providers: [
    NgRedux,
  ],
  bootstrap: [Example]
})
export class ExampleModule {}

