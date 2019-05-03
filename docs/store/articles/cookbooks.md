# Cookbooks

## Using Angular Services in your Action Creators

In order to use services in action creators, we need to integrate
them into Angular's dependency injector.

We may as well adopt a more class-based approach to satisfy
Angular 2's OOP idiom, and to allow us to

1.  make our actions `@Injectable()`, and
2.  inject other services for our action creators to use.

Take a look at this example, which injects NgRedux to access
`dispatch` and `getState` (a replacement for `redux-thunk`),
and a simple `RandomNumberService` to show a side effect.

```typescript
import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import * as Redux from 'redux';
import { RootState } from '../store';
import { RandomNumberService } from '../services/random-number';

@Injectable()
export class CounterActions {
  constructor(
    private ngRedux: NgRedux<RootState>,
    private randomNumberService: RandomNumberService,
  ) {}

  static INCREMENT_COUNTER: string = 'INCREMENT_COUNTER';
  static DECREMENT_COUNTER: string = 'DECREMENT_COUNTER';
  static RANDOMIZE_COUNTER: string = 'RANDOMIZE_COUNTER';

  // Basic action
  increment(): void {
    this.ngRedux.dispatch({ type: CounterActions.INCREMENT_COUNTER });
  }

  // Basic action
  decrement(): void {
    this.ngRedux.dispatch({ type: CounterActions.DECREMENT_COUNTER });
  }

  // Async action.
  incrementAsync(delay: number = 1000): void {
    setTimeout(this.increment.bind(this), delay);
  }

  // State-dependent action
  incrementIfOdd(): void {
    const { counter } = this.ngRedux.getState();
    if (counter % 2 !== 0) {
      this.increment();
    }
  }

  // Service-dependent action
  randomize(): void {
    this.ngRedux.dispatch({
      type: CounterActions.RANDOMIZE_COUNTER,
      payload: this.randomNumberService.pick(),
    });
  }
}
```

To use these action creators, we can just go ahead and inject
them into our component:

```typescript
import { Component } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { CounterActions } from '../actions/counter-actions';
import { RandomNumberService } from '../services/random-number';

@Component({
  selector: 'counter',
  providers: [CounterActions, RandomNumberService],
  template: `
    <p>
      Clicked: {{ counter$ | async }} times
      <button (click)="actions.increment()">+</button>
      <button (click)="actions.decrement()">-</button>
      <button (click)="actions.incrementIfOdd()">Increment if odd</button>
      <button (click)="actions.incrementAsync(2222)">Increment async</button>
      <button (click)="actions.randomize()">Set to random number</button>
    </p>
  `,
})
export class Counter {
  @select('counter') counter$: any;

  constructor(private actions: CounterActions) {}
}
```

## Using Angular 2 Services in your Middleware

Again, we just want to use Angular DI the way it was meant to be used.

Here's a contrived example that fetches a name from a remote API using Angular's
`Http` service:

```typescript
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LogRemoteName {
  constructor(private http: Http) {}

  middleware = store => next => action => {
    console.log('getting user name');
    this.http.get('http://jsonplaceholder.typicode.com/users/1')
      .map(response => {
        console.log('got name:', response.json().name);
        return next(action);
      })
      .catch(err => console.log('get name failed:', err));
    }
    return next(action);
}
```

As with the action example above, we've attached our middleware function to
an `@Injectable` class that can itself receive services from Angular's
dependency injector.

Note the arrow function called `middleware`: this is what we can pass to the
middlewares parameter when we initialize ngRedux in our top-level component. We
use an arrow function to make sure that what we pass to ngRedux has a
properly-bound function context.

```typescript
import { NgModule } from '@angular/core';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import reduxLogger from 'redux-logger';
import { LogRemoteName } from './middleware/log-remote-name';

@NgModule({
  /* ... */
  imports: [, /* ... */ NgReduxModule],
  providers: [
    LogRemoteName,
    /* ... */
  ],
})
export class AppModule {
  constructor(
    private ngRedux: NgRedux<IAppState>,
    logRemoteName: LogRemoteName,
  ) {
    const middleware = [reduxLogger, logRemoteName.middleware];
    this.ngRedux.configureStore(rootReducer, {}, middleware);
  }
}
```

## Side-Effect Management Using Epics

`@angular-redux/store` also works well with the `Epic` feature of
[redux-observable](https://github.com/redux-observable). For
example, a common use case for a side-effect is making an API call; while
we can use asynchronous actions for this, epics provide a much cleaner
approach.

Consider the following example of a user login implementation. First, we
create some trivial actions:

**session.actions.ts:**

```typescript
import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../reducers';

@Injectable()
export class SessionActions {
  static LOGIN_USER = 'LOGIN_USER';
  static LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
  static LOGIN_USER_ERROR = 'LOGIN_USER_ERROR';
  static LOGOUT_USER = 'LOGOUT_USER';

  constructor(private ngRedux: NgRedux<IAppState>) {}

  loginUser(credentials) {
    this.ngRedux.dispatch({
      type: SessionActions.LOGIN_USER,
      payload: credentials,
    });
  }

  logoutUser() {
    this.ngRedux.dispatch({ type: SessionActions.LOGOUT_USER });
  }
}
```

Next, we create an `@Injectable SessionEpic` service:

**session.epics.ts:**

```typescript
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ActionsObservable } from 'redux-observable';
import { SessionActions } from '../actions/session.actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

const BASE_URL = '/api';

@Injectable()
export class SessionEpics {
  constructor(private http: Http) {}

  login = (action$: ActionsObservable) => {
    return action$.ofType(SessionActions.LOGIN_USER).mergeMap(({ payload }) => {
      return this.http
        .post(`${BASE_URL}/auth/login`, payload)
        .map(result => ({
          type: SessionActions.LOGIN_USER_SUCCESS,
          payload: result.json().meta,
        }))
        .catch(error =>
          Observable.of({
            type: SessionActions.LOGIN_USER_ERROR,
          }),
        );
    });
  };
}
```

This needs to be a service so that we can inject Angular's `HTTP` service.
However in this case we're using the same "arrow function bind trick" as we
did for the dependency-injected middleware cookbook above.

This allows us to configure our Redux store with the new epic as follows:

**app.component.ts:**

```typescript
import { NgModule } from '@angular/core';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { createEpicMiddleware } from 'redux-observable';
import rootReducer from './reducers';
import { SessionEpics } from './epics';

@NgModule({
  /* ... */
  imports: [, /* ... */ NgReduxModule],
  providers: [
    SessionEpics,
    /* ... */
  ],
})
export class AppModule {
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private epics: SessionEpics,
  ) {
    const middleware = [createEpicMiddleware(this.epics.login)];
    ngRedux.configureStore(rootReducer, {}, middleware);
  }
}
```

Now, whenever you dispatch a "USER_LOGIN" action, the epic will trigger the
HTTP request, and fire a corresponding success or failure action. This allows
you to keep your action creators very simple, and to cleanly describe your
side effects as a set of simple RxJS epics.

## Using DevTools

`@angular-redux/store` is fully compatible with the Chrome extension version of the Redux dev
tools:

https://github.com/zalmoxisus/redux-devtools-extension

However, due to peculiarities of Angular's change detection logic,
events that come from external tools don't trigger a refresh in Angular's
zone.

We've taken the liberty of providing a wrapper around the extension
tools that handles this for you.

Here's how to hook the extension up to your app:

```typescript
import {
  NgReduxModule,
  NgRedux,
  DevToolsExtension,
} from '@angular-redux/store';

// Add the dev tools enhancer your ngRedux.configureStore called
// when you initialize your root component:
@NgModule({
  /* ... */
  imports: [, /* ... */ NgReduxModule],
})
export class AppModule {
  constructor(private ngRedux: NgRedux, private devTools: DevToolsExtension) {
    let enhancers = [];
    // ... add whatever other enhancers you want.

    // You probably only want to expose this tool in devMode.
    if (__DEVMODE__ && devTools.isEnabled()) {
      enhancers = [...enhancers, devTools.enhancer()];
    }

    this.ngRedux.configureStore(rootReducer, initialState, [], enhancers);
  }
}
```

`ReduxDevTools.enhancer()` takes the same options parameter as
documented here: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#windowdevtoolsextensionconfig

## Using ImmutableJS

### What is ImmutableJS

[ImmutableJS](https://facebook.github.io/immutable-js/) is a library that
provides efficient immutable data structures for JavaScript, and it's a great
tool to help enforce immutability in your reducers.

It provides two main structures, `Map` and `List`, which are analogues of
`Object` and `Array`. However they provide an efficiently-implemented
copy-on-write semantic that can help you enforce immutability in your reducers
without the performance problems of `Object.freeze` or the GC churn of
`Object.assign`.

It also provides helper methods for deeply querying (`getIn`) or modifying
(`setIn`) nested objects.

### Why do I care?

Many people who do Redux implement their stores in terms of ImmutableJS data
structures. This provides a safety-net against accidental mutation of the store,
either in reducers or in reactive operator sequences attached to your
observables. However it comes at a syntactic cost: with `Immutable.Map`, you
can no longer easily dereference properties:

```typescript
const mutableFoo = {
  foo: 1,
};

const foo: number = mutableFoo.foo;
```

becomes:

```typescript
const immutableFoo: Map<string, any> = Immutable.fromJS({
  foo: 1;
});

const foo: number = immutableFoo.get('foo');
```

### Pre 3.3.0:

Previous to 3.3.0 we were forced to choose between the guarantees of ImmutableJS
and the syntactic convenience of raw objects:

#### Raw Objects in the Store

Imagine a store with the following shape:

```typescript
{
  totalCount: 0,
  counts: {
    firstCount: 0,
    secondCount: 0
  }
};
```

Without ImmutableJS, we could write in our components:

```typescript
// Path selector
@select(['counts', 'firstCount']) firstCount$: Observable<number>;

// Selecting an immutable object
@select() counts$: Observable<ICounts>;

constructor() {
  this.counts$.map(counts: ICount => {
    // oh noes: bad mutation, subtle bug!
    return counts.firstCount++;
  });
}
```

We get the syntactic convenience of raw objects, but no protection against
accidental mutation.

#### Immutable Objects in the Store

Here's that same conceptual store, defined immutably:

```typescript
Immutable.Map<string, any>({
  totalCount: 0,
  counts: Immutable.map<string, number>({
    firstCount: 0,
    secondCount: 0,
  }),
});
```

Now we are protected against accidental mutation:

```typescript
constructor() {
  this.counts$.map(counts: Map<string, number> => {
    // Type error: firstCount is not a property of Immutable.Map.
    return counts.firstCount++;
  });
}
```

But we are restricted to using the function selectors. which are less
declarative:

```typescript
// Path selector no longer possible: must supply a function.
@select(s => s.getIn(['counts', 'firstCount']) firstCount$: Observable<number>;
@select(s => s.get('counts')) counts$: Observable<Map<string, number>>;

constructor() {
  this.counts$.map(counts: Map<string, number> => {
    // Correct: we are forced into the non-mutating approach.
    return counts.get('firstCount') + 1;
  });
}
```

### Post 3.3.0:

In `@angular-redux/store` 3.3.0 we've allowed you to have your cake and eat it too: the
`@select` decorator can now detect if the selected state is an ImmutableJS
construct and call `.get` or `.getIn` for you.

So you no longer have to sacrifice declarative syntax for mutation-safety:

```typescript
// Path selector
@select(['counts', 'firstCount']) firstCount$: Observable<number>;

// Selecting an immutable object
@select() counts$: Observable<Map<string, number>>;

constructor() {
  this.counts$.map(counts: Map<string, number> => {
    // Correct: we are forced into the non-mutating approach.
    return counts.get('firstCount') + 1;
  });
}
```

Note that ImmutableJS is still optional. We don't depend on it directly
and you're not required to use it. But if you do, we've got you covered!

## Strongly Typed Reducers

It's good practice in typescript to be as specific about your types as possible.
This helps you catch errors at compile-time instead of run-time.

Reducers are no exception to this rule. However it's not always obvious how to
make this happen in practice.

### Reducer Typing Best Practices

#### Define an Interface for your State

It's important to strongly type the data in your store, and this is done by
defining types for the `state` arguments to your reducers:

```typescript
export type TFoo: string;

// Being explicit about the state argument and return types ensures that all your
// reducer's cases return the correct type.
export const fooReducer = (state: TFoo, action): TFoo => {
  // ...
};

export interface IBar {
  a: number;
  b: string;
}

export const barReducer = (state: IBar, action): IBar => {
  // ...
};
```

Since most applications are composed of several reducers, you should compose
a global 'AppState' by composing the reducer types:

```typescript
export interface IAppState {
  foo?: TFoo;
  bar?: IBar;
}

export const rootReducer = combineReducers({
  foo: fooReducer,
  bar: barReducer,
});
```

This 'app state' is what you should use when injecting `NgRedux`:

```typescript
import { Injectable } from '@angular/core';
import { IAppState } from './store';

@Injectable()
export class MyActionService {
  constructor(private ngRedux: NgRedux<IAppState>) {}

  // ...
}
```

#### Consider Using Built-In Types from Redux

Redux ships with a good set of official typings; consider using them. In
particular, consider importing and using the `Action` and `Reducer` types:

```typescript
import { Action, Reducer } from 'redux';

export const fooReducer: Reducer<TFoo> = (
  state: TFoo,
  action: Action,
): TFoo => {
  // ...
};
```

Note that we supply this reducer's state type as a generic type parameter to `Reducer<T>`.

#### Consider using 'Flux Standard Actions' (FSAs)

[FSA](https://github.com/acdlite/flux-standard-action/blob/master/src/index.js)
is a widely-used convention for defining the shape of actions. You can import
in into your project and use it:

```sh
npm install --save flux-standard-action
```

Flux standard actions take 'payload', and 'error' parameters in addition to the
basic `type`. Payloads in particular help you strengthen your reducers even
further:

```typescript
import { Reducer } from 'redux';
import { Action } from 'flux-standard-action';

export const fooReducer: Reducer<TFoo> = (
  state: TFoo,
  action: Action<TFoo>,
): TFoo => {
  // ...
};
```

Here we're saying that the action's payload must have type TFoo.
If you need more flexibility in payload types, you can use a union and
[type assertions](https://www.typescriptlang.org/docs/handbook/advanced-types.html):

```typescript
export const barReducer: Reducer<IBar> = (
  state: IBar,
  action: Action<number | string>,
): IBar => {
  switch (action.type) {
    case A_HAS_CHANGED:
      return Object.assign({}, state, {
        a: <number>action.payload,
      });
    case B_HAS_CHANGED:
      return Object.assign({}, state, {
        b: <string>action.payload,
      });
    // ...
  }
};
```

For more complex union-payload scenarios, Typescript's [type-guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html) may also be helpful.

#### Use a Typed Wrapper around Object.assign

In the Babel world, reducers often use `Object.assign` or property spread to
maintain immutability. This works in Typescript too, but it's not typesafe:

```typescript
export const barReducer: Reducer<IBar> = (
  state: IBar,
  action: Action<number | string>,
): IBar => {
  switch (action.type) {
    case A_HAS_CHANGED:
      return Object.assign({}, state, {
        a: <number>action.payload,
        zzz: 'test', // We'd like this to generate a compile error, but it doesn't
      });
    // ...
  }
};
```

Ideally, we'd like this code to fail because `zzz` is not a property of the state.
However, the built-in type definitions for `Object.assign` return an intersection
type, making this legal. This makes sense for general usage of `Object.assign`,
but it's not what we want in a reducer.

Instead, we've provided a type-corrected immutable assignment function, [`tassign`](https://npmjs.com/package/tassign),
that will catch this type of error:

```typescript
import { tassign } from 'tassign';

export const barReducer: Reducer<IBar> = (
  state: IBar,
  action: Action<number | string>,
): IBar => {
  switch (action.type) {
    case A_HAS_CHANGED:
      return tassign(state, {
        a: <number>action.payload,
        zzz: 'test', // Error: zzz is not a property of IBar
      });
    // ...
  }
};
```

Following these tips to strengthen your reducer typings will go a long way
towards more robust code.
