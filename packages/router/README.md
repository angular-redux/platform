# ng2-redux-router
### Bindings to connect @angular/router to ng2-redux

This package uses the new v3 alpha router for angular 2 `@angular/router@v3.0.0-alpha.7`.

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

3. Bootstrap the bindings in your root component.
  ```ts
  import { NgRedux } from 'ng2-redux';
  import { ROUTER_PROVIDERS } from '@angular/router';
  import { NgReduxRouter } from 'ng2-redux-router';

  bootstrap(App, [
    ROUTER_PROVIDERS,
    NgRedux,
    NgReduxRouter
  ]);
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

#### What if I use Immutable.js with my Redux store?

When using a wrapper for your store's state, such as Immutable.js, you will need to change two things from the standard setup:

1. Provide your own reducer function that will receive actions of type  `UPDATE_LOCATION` and return the payload merged into state.
2. Pass a selector to access the payload state and convert it to a JS object via the `selectLocationFromState` option on `NgReduxRouter`'s `initialize()`.

These two hooks will allow you to store the state that this library uses in whatever format or wrapper you would like.
