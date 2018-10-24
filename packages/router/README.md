# @angular-redux/router

[![Join the chat at https://gitter.im/angular-redux/ng2-redux](https://badges.gitter.im/angular-redux/ng2-redux.svg)](https://gitter.im/angular-redux/ng2-redux?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://img.shields.io/npm/v/@angular-redux/router.svg)](https://www.npmjs.com/package/@angular-redux/router)
[![downloads per month](https://img.shields.io/npm/dm/@angular-redux/router.svg)](https://www.npmjs.com/package/@angular-redux/router)

Bindings to connect @angular/router to @angular-redux/core

## Which version should I use?

For use with Angular 6: Use v9.

For use with Angular 5: Use v7.

For use with Angular 2-4: Use v6.

### Setup

1.  Use npm to install the bindings:

```
npm install @angular-redux/router --save
```

2.  Use the `routerReducer` when providing `Store`:

```ts
import { combineReducers } from 'redux';
import { routerReducer } from '@angular-redux/router';

export default combineReducers<IAppState>({
  // your reducers..
  router: routerReducer,
});
```

3.  Add the bindings to your root module.

```ts
import { NgModule } from '@angular/core';
import { NgReduxModule, NgRedux } from '@angular-redux/core';
import { NgReduxRouterModule, NgReduxRouter } from '@angular-redux/router';
import { RouterModule } from '@angular/router';
import { routes } from './routes';

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    NgReduxModule,
    NgReduxRouterModule.forRoot(),
    // ...your imports
  ],
  // Other stuff..
})
export class AppModule {
  constructor(ngRedux: NgRedux<IAppState>, ngReduxRouter: NgReduxRouter) {
    ngRedux.configureStore(/* args */);
    ngReduxRouter.initialize(/* args */);
  }
}
```

### What if I use Immutable.js with my Redux store?

When using a wrapper for your store's state, such as Immutable.js, you will need to change two things from the standard setup:

1.  Provide your own reducer function that will receive actions of type `UPDATE_LOCATION` and return the payload merged into state.
2.  Pass a selector to access the payload state and convert it to a JS object via the `selectLocationFromState` option on `NgReduxRouter`'s `initialize()`.

These two hooks will allow you to store the state that this library uses in whatever format or wrapper you would like.

### What if I have a different way of supplying the current URL of the page?

Depending on your app's needs. It may need to supply the current URL of the page differently than directly
through the router. This can be achieved by initializing the bindings with a second argument: `urlState$`.
The `urlState$` argument lets you give `NgReduxRouter` an `Observable<string>` of the current URL of the page.
If this argument is not given to the bindings, it defaults to subscribing to the `@angular/router`'s events, and
getting the URL from there.

### Examples

- [Example-app: An example of using @angular-redux/router along with the other companion packages.](https://github.com/angular-redux/platform/tree/master/packages/example-app)
