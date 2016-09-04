import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NgRedux, select } from 'ng2-redux';

import { RootState, enhancers } from '../store';

import { NgReduxRouter } from 'ng2-redux-router';

import reducer from '../reducers/index';
const createLogger = require('redux-logger');

@Component({
    selector: 'root',
    template: `
    <a [routerLink]="['/first']">First</a>
    <a [routerLink]="['/second']">Second</a>
    <a [routerLink]="['/third']">Third</a>
    <counter></counter>
    <counter-info></counter-info>

    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(
    private ngRedux: NgRedux<RootState>,
    private ngReduxRouter: NgReduxRouter
  ) {
    this.ngRedux.configureStore(
        reducer,
        { counter: 0 },
        [ createLogger() ],
        enhancers
    );
    ngReduxRouter.initialize();
  }
}

@Component({
    selector: 'first',
    template: `
    first
  `
})
export class FirstComponent {
}

@Component({
    selector: 'second',
    template: `
    second
  `
})
export class SecondComponent {
}

@Component({
    selector: 'third',
    template: `
    third
  `
})
export class ThirdComponent {
}
