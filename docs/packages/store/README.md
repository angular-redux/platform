[![npm version](https://img.shields.io/npm/v/@angular-redux/store.svg)](https://www.npmjs.com/package/@angular-redux/store)
[![downloads per month](https://img.shields.io/npm/dm/@angular-redux/store.svg)](https://www.npmjs.com/package/@angular-redux/store)

# Getting Started

- I already know what Redux and RxJS are. [Give me the TL;DR](#quickstart).
- I'm just learning about Redux. [Break it down for me](packages/store/articles/intro-tutorial)!
- Talk is cheap. [Show me a complete code example](https://github.com/angular-redux/example-app).
- Take me to the [API docs](https://angular-redux.github.io/platform).

## Quickstart

`@angular-redux/store` has a peer dependency on redux, so we need to install it.

```sh
npm install --save redux @angular-redux/store
```

```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './containers/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
```

Import the `NgReduxModule` class and add it to your application module as an
`import`. Once you've done this, you'll be able to inject `NgRedux` into your
Angular components. In your top-level app module, you
can configure your Redux store with reducers, initial state,
and optionally middlewares and enhancers as you would in Redux directly.

```typescript
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { createLogger } from 'redux-logger';
import { rootReducer } from './reducers';

interface IAppState {
  /* ... */
}

@NgModule({
  /* ... */
  imports: [, /* ... */ NgReduxModule],
})
export class AppModule {
  constructor(ngRedux: NgRedux<IAppState>) {
    ngRedux.configureStore(rootReducer, {}, [createLogger()]);
  }
}
```

Or if you prefer to create the Redux store yourself you can do that and use the
`provideStore()` function instead:

```typescript
import {
  applyMiddleware,
  Store,
  combineReducers,
  compose,
  createStore,
} from 'redux';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { createLogger } from 'redux-logger';
import { rootReducer } from './reducers';

interface IAppState {
  /* ... */
}

export const store: Store<IAppState> = createStore(
  rootReducer,
  applyMiddleware(createLogger()),
);

@NgModule({
  /* ... */
  imports: [, /* ... */ NgReduxModule],
})
class AppModule {
  constructor(ngRedux: NgRedux<IAppState>) {
    ngRedux.provideStore(store);
  }
}
```

> Note that we're also using a Redux middleware from the community here:
> [redux-logger](https://www.npmjs.com/package/redux-logger). This is just to show
> off that `@angular-redux/store` is indeed compatible with Redux middlewares as you
> might expect.
>
> Note that to use it, you'll need to install it with `npm install --save redux-logger`
> and type definitions for it with `npm install --save-dev @types/redux-logger`.

Now your Angular app has been reduxified! Use the `@select` decorator to
access your store state, and `.dispatch()` to dispatch actions:

```typescript
import { select } from '@angular-redux/store';

@Component({
  template:
    '<button (click)="onClick()">Clicked {{ count | async }} times</button>',
})
class App {
  @select() count$: Observable<number>;

  constructor(private ngRedux: NgRedux<IAppState>) {}

  onClick() {
    this.ngRedux.dispatch({ type: INCREMENT });
  }
}
```

---

# Companion Packages

- [Reduxify your Routing with @angular-redux/router](https://github.com/angular-redux/platform/blob/master/packages/router)
- [Reduxify your Forms with @angular-redux/form](https://github.com/angular-redux/platform/blob/master/packages/form)

# Resources

- [Using Redux with Angular - JS Toronto Meetup 2016-07-12](https://www.youtube.com/watch?v=s4xr2avwv3s)
- [Getting started with Redux](https://egghead.io/courses/getting-started-with-redux)
- [Awesome Redux: Community Resources](https://github.com/xgrommx/awesome-redux)

# In-Depth Usage

`@angular-redux/store` uses an approach to redux based on RxJS Observables to `select` and transform
data on its way out of the store and into your UI or side-effect handlers. Observables
are an efficient analogue to `reselect` for the RxJS-heavy Angular world.

## Select Pattern

### The Select Pattern

The select pattern allows you to get slices of your state as RxJS observables.

These plug in very efficiently to Angular's change detection mechanism and this is the
preferred approach to accessing store data in Angular.

### The @select decorator

The `@select` decorator can be added to the property of any class or angular
component/injectable. It will turn the property into an observable which observes
the Redux Store value which is selected by the decorator's parameter.

The decorator expects to receive a `string`, an array of `string`s, a `function` or no
parameter at all.

- If a `string` is passed the `@select` decorator will attempt to observe a store
  property whose name matches the `string`.
- If an array of strings is passed, the decorator will attempt to match that path
  through the store (similar to `immutableJS`'s `getIn`).
- If a `function` is passed the `@select` decorator will attempt to use that function
  as a selector on the RxJs observable.
- If nothing is passed then the `@select` decorator will attempt to use the name of the class property to find a matching value in the Redux store. Note that a utility is in place here where any \$ characters will be ignored from the class property's name.

```typescript
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';

@Component({
  selector: 'counter-value-printed-many-times',
  template: `
    <p>{{ counter$ | async }}</p>
    <p>{{ counter | async }}</p>
    <p>{{ counterSelectedWithString | async }}</p>
    <p>{{ counterSelectedWithFunction | async }}</p>
    <p>{{ counterSelectedWithFunctionAndMultipliedByTwo | async }}</p>
  `,
})
export class CounterValue {
  // this selects `counter` from the store and attaches it to this property
  // it uses the property name to select, and ignores the $ from it
  @select() counter$;

  // this selects `counter` from the store and attaches it to this property
  @select() counter;

  // this selects `counter` from the store and attaches it to this property
  @select('counter') counterSelectedWithString;

  // this selects `pathDemo.foo.bar` from the store and attaches it to this
  // property.
  @select(['pathDemo', 'foo', 'bar'])
  pathSelection;

  // this selects `counter` from the store and attaches it to this property
  @select(state => state.counter)
  counterSelectedWithFunction;

  // this selects `counter` from the store and multiples it by two
  @select(state => state.counter * 2)
  counterSelectedWithFuntionAndMultipliedByTwo: Observable<any>;
}
```

## Select Without Decorators

If you like RxJS, but aren't comfortable with decorators, you can also make
store selections using the `ngRedux.select()` function.

```typescript
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Counter } from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import { NgRedux } from '@angular-redux/store';

interface IAppState {
  counter: number;
}

@Component({
  selector: 'root',
  template: `
    <counter
      [counter]="counter$ | async"
      [increment]="increment"
      [decrement]="decrement"
    >
    </counter>
  `,
})
export class Counter {
  private count$: Observable<number>;

  constructor(private ngRedux: NgRedux<IAppState>) {}

  ngOnInit() {
    let { increment, decrement } = CounterActions;
    this.counter$ = this.ngRedux.select('counter');
  }

  incrementIfOdd = () =>
    this.ngRedux.dispatch(<any>CounterActions.incrementIfOdd());

  incrementAsync = () =>
    this.ngRedux.dispatch(<any>CounterActions.incrementAsync());
}
```

`ngRedux.select` can take a property name or a function which transforms a property.
Since it's an observable, you can also transform data using observable operators like
`.map`, `.filter`, etc.

## The @select\$ decorator

The `@select$` decorator works similar to `@select`, however you are able to specify observable chains to execute on the selected result.

```typescript
import { select$ } from 'angular-redux/store';

export const debounceAndTriple = obs$ => obs$.debounce(300).map(x => 3 * x);

class Foo {
  @select$(['foo', 'bar'], debounceAndTriple)
  readonly debouncedFooBar$: Observable<number>;
}
```

# Cookbooks

- [Using Angular's Dependency Injector with Action Creators](articles/action-creator-service.md)
- [Using Angular's Dependency Injector with Middlewares](articles/di-middleware.md)
- [Managing Side-Effects with redux-observable Epics](articles/epics.md)
- [Using the Redux DevTools Chrome Extension](https://github.com/angular-redux/store/blob/master/articles/redux-dev-tools.md)
- [@angular-redux/store and ImmutableJS](https://github.com/angular-redux/store/blob/master/articles/immutable-js.md)
- [Strongly Typed Reducers](https://github.com/angular-redux/store/blob/master/articles/strongly-typed-reducers.md)
