== ng2-redux-form

This library is a thin layer of connective tissue between Angular 2 forms and
Redux. It provides unidirectional data binding between your Redux state and
your forms elements. It builds on existing Angular functionality like
[https://angular.io/docs/js/latest/api/common/index/NgControl-class.html](NgControl)
and
[https://angular.io/docs/ts/latest/api/common/index/NgModel-directive.html](NgModel).

For the simplest use-cases, the API is very straightforward. Your template
would look something like this:

```html
  <form connect="myForm">
    <input type="text" name="address" ngControl ngModel />
  </form>
```

Then, in your application bootstrap code, you need to add a provider for
the class that is responsible for connecting your forms to your Redux state.
There are two ways of doing this: either using an `Redux.Store<T>` object or
an `NgRedux<T>` object. There are no substantial differences between these
approaches, but if you are already using
[https://github.com/angular-redux/ng2-redux](ng2-redux) or you wish to integrate
it into your project, then you would do something like this:

```typescript
import { provideFormConnect } from 'ng2-redux-form';

const ngRedux = new NgRedux<AppState>();

ngRedux.configureStore(reducer, myInitialState, [], []);

bootstrap(MyApplication, [
  provide(NgRedux, {useValue: ngRedux}),
  provideForms(),
  disableDeprecatedForms(),
  provideFormConnect(ngRedux)
]);
```

Or if you are using Redux without ng2-redux, then your bootstrap call would look
more like this (substitute your own store creation code):

```typescript
import { provideFormConnect } from 'ng2-redux-form';

const storeCreator = compose(applyMiddleware(logger))(createStore);
const store = create(reducers, <MyApplicationState> {});

bootstrap(MyApplication, [
  disableDeprecatedForms(),
  provideForms(),
  provideFormConnect(store),
]);
```

(Note that in these examples, we are explicitly disabling the old Angular 2 forms
API. You should too. The deprecated forms API will be removed at some point in the
near future so you should build your application using the new one from
`provideForms`.)

The essential bit of code in the above samples is the call to `provideFormConnect(...)`.
This configures ng2-form-redux and provides access to your Redux store or NgRedux
instance. The shape of the object that `provideFormConnect` expects is very
basic:

```typescript
export interface AbstractStore<RootState> {
  /// Dispatch an action
  dispatch(action: Action & {payload?}): void;

  /// Retrieve the current application state
  getState(): RootState;

  /// Subscribe to changes in the store
  subscribe(fn: () => void): Redux.Unsubscribe;
}
```

Both `NgRedux<T>` and `Redux.Store<T>` conform to this shape. If you have something
complicated use-case that is not covered here, you could even create your own store
shim as long as it conforms to the shape of `AbstractStore<RootState>`.

=== Reducers

The library will automatically bind your state to value of your form inputs. This is
the easy part and is unlikely to cause any problems for you. Slightly more difficult
is _updating your Redux state_ when the form values change. There are two approaches
that you can take in order to do this.

The first, and by far the simplest, is to use the reducer that comes with ng2-redux-form
and uses the value supplied in `connect` and the form input names in order to update
your Redux state automatically. If you do not need to do any special processing on
your data when the user updates form inputs, then you should use this default reducer.
To use it, you need to combine it with your existing reducers like so:

```typescript
import { composeReducers, defaultFormReducer } from 'ng2-redux-form';

const reducer = composeReducers(
  defaultFormReducer(),
  combineReducers({
    foo: fooReducer,
    bar: barReducer
  })
);
```

The important bits of code here are the calls to `composeReducers` and `defaultFormReducer`.
The call to `composeReducers` essentially takes your existing reducer configuration and
chains them together with `defaultFormReducer`. The default form reducer only handles one
action, `{FORM_CHANGED}`. You can think of it like so:

function defaultFormReducer(state, action: Redux.Action & {payload?}) {
  switch (action.type) {
    case FORM_CHANGED:
      [return new state with form values from action.payload];
    default:
      break;
  }
  return state;
}

If you have a more complex use-case that the default form reducer is incompatible with,
then you can very easily just handle the FORM_CHANGED actions in your existing reducers
and manually update your state with the form values from `action.payload.value`, which
has the shape of an object containing all of your raw form values:

```json
{
  "address1": "129 Spadina Ave",
  "address2": "Toronto, Ontario M4Y 1F7",
  "otherGroup": {
    "foo": "bar",
    "biz": 1
  }
}
```

This would match a form that looks like this:

```html
<form connect>
  <input name="address1" ngControl ngModel type="text" />
  <input name="address2" ngControl ngModel type="text" />
  <form name="otherGroup">
    <input name="foo" ngControl ngModel type="text" />
    <input name="biz" ngControl ngModel type="number" />
  </form>
</form>
```

Note: If you implement your own reducer instead of using the default one provided by
ng2-form-redux, the state you return still needs to match the shape of your form,
otherwise data-binding is not going to work. This is why it probably makes sense to
just use the default reducer in almost every case - because your custom reducer would
have to implement the same logic and produce a state object that is the same shape.
But if you are having trouble with the default reducer, or if you find the fact that
you have to use `composeReducers` distasteful, then this is another route available
to you.

== Examples

The `examples` directory contains some examples of how to use ng2-redux-form and
how to connect it to your application. You may also find it useful to debug and
step through the examples and the unit tests to get a better understanding of how
the library works.

The unit tests in `*.test.ts` files also contain useful examples of how to build
forms using ng2-redux-form.