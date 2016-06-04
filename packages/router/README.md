# ng2-redux-router
### Bindings to connect @angular/router to ng2-redux

Inspired by `@ngrx/router-store`

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
      ngReduxRouter.initialize();
    }
  }
  ```
