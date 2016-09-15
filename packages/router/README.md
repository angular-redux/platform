# ng2-redux-router 1.3.3
### Bindings to connect @angular/router to ng2-redux

Updated for Angular 2 final release.

This package uses the new v3 router for angular 2 `@angular/router@^3.0.0`.

### Setup

1. Use npm to install the bindings:
  ```
  npm install ng2-redux-router --save
  ```

2. Use the `routerReducer` when providing `Store`:
  ```ts
  import { combineReducers } from 'redux';
  import { routerReducer } from 'ng2-redux-router';

  export default combineReducers<IAppState>({
    // your reducers..
    router: routerReducer
  });
  ```

3. Add the bindings to your root module.
  ```ts
  import { NgModule } from '@angular/core';
  import { AppComponent } from './app.component';
  import { NgRedux } from 'ng2-redux';
  import { NgReduxRouter } from 'ng2-redux-router';
  import { RouterModule } from '@angular/router';
  import { routes } from './routes';

  @NgModule({
    imports: [
      RouterModule.forRoot(routes),
      // ...your imports
    ],
    declarations: [
      AppComponent,
      // ...your declarations
    ],
    providers: [
      NgRedux,
      NgReduxRouter,
      // ...your providers
    ],
    bootstrap: [
      AppComponent
    ]
  })
  export class AppModule {}
```

4. Initialize the bindings from your app component
  ```ts
  import { NgRedux } from 'ng2-redux';
  import { NgReduxRouter } from 'ng2-redux-router';

  @Component({
    // ...
  })
  @Routes([
    // ...
  ])
  export class App {
    constructor(
      private ngRedux: NgRedux<IAppState>,
      private ngReduxRouter: NgReduxRouter
    ) {
      ngRedux.configureStore(/* args */);
      ngReduxRouter.initialize(/* args */);
    }
  }
  ```

### What if I use Immutable.js with my Redux store?

When using a wrapper for your store's state, such as Immutable.js, you will need to change two things from the standard setup:

1. Provide your own reducer function that will receive actions of type  `UPDATE_LOCATION` and return the payload merged into state.
2. Pass a selector to access the payload state and convert it to a JS object via the `selectLocationFromState` option on `NgReduxRouter`'s `initialize()`.

These two hooks will allow you to store the state that this library uses in whatever format or wrapper you would like.

### What if I have a different way of supplying the current URL of the page?

Depending on your app's needs. It may need to supply the current URL of the page differently than directly
through the router. This can be achieved by initializing the bindings with a second argument: `urlState$`.
The `urlState$` argument lets you give `NgReduxRouter` an `Observable<string>` of the current URL of the page.
If this argument is not given to the bindings, it defaults to subscribing to the `@angular/router`'s events, and
getting the URL from there.

### Examples

* [Counter: basic setup of ng2-redux-router](examples/counter)
