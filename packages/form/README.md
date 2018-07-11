## @angular-redux/form

[![Join the chat at https://gitter.im/angular-redux/ng2-redux](https://badges.gitter.im/angular-redux/ng2-redux.svg)](https://gitter.im/angular-redux/ng2-redux?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://img.shields.io/npm/v/@angular-redux/form.svg)](https://www.npmjs.com/package/@angular-redux/form)
[![downloads per month](https://img.shields.io/npm/dm/@angular-redux/form.svg)](https://www.npmjs.com/package/@angular-redux/form)

This library is a thin layer of connective tissue between Angular 2+ forms and
Redux. It provides unidirectional data binding between your Redux state and
your forms elements. It builds on existing Angular functionality like
[NgModel](https://angular.io/docs/ts/latest/api/forms/index/NgModel-directive.html)
and
[NgControl](https://angular.io/docs/ts/latest/api/forms/index/NgControl-class.html)

This supports both [Template driven forms](https://angular.io/guide/forms) and [Reactive driven forms](https://angular.io/guide/reactive-forms).

#### Template Driven

For the simplest use-cases, the API is very straightforward. Your template
would look something like this:

```html
  <form connect="myForm">
    <input type="text" name="address" ngControl ngModel />
  </form>
```

The important bit to note here is the `[connect]` directive. This is the only thing
you should have to add to your form template in order to bind it to your Redux state.
The argument provided to `connect` is basically a path to form state inside of your
overall app state. So for example if my Redux app state looks like this:

```json
{
  "foo": "bar",
  "myForm": {
    "address": "1 Foo St."
  }
}
```

Then I would supply `myForm` as the argument to `[connect]`. If myForm were nested
deeper inside of the app state, you could do something like this:

```html
<form [connect]="['personalInfo', 'myForm']">
  ...
</form>
```

Note that ImmutableJS integration is provided seamlessly. If `personalInfo` is an
immutable Map structure, the library will automatically use `get()` or `getIn()` to
find the appropriate bits of state.

Then, in your application bootstrap code, you need to add a provider for
the class that is responsible for connecting your forms to your Redux state.
There are two ways of doing this: either using an `Redux.Store<T>` object or
an `NgRedux<T>` object. There are no substantial differences between these
approaches, but if you are already using
[@angular-redux/store](https://github.com/angular-redux/store) or you wish to integrate
it into your project, then you would do something like this:

```typescript
import { NgReduxModule } from '@angular-redux/store';
import { NgReduxFormModule } from '@angular-redux/form';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    NgReduxFormModule,
    NgReduxModule,
  ],
  bootstrap: [MyApplicationComponent],
})
export class ExampleModule {}
```

Or if you are using Redux without `@angular-redux/store`, then your bootstrap call would look
more like this (substitute your own store creation code):

```typescript
import { provideReduxForms } from '@angular-redux/form';

const storeCreator = compose(applyMiddleware(logger))(createStore);
const store = create(reducers, <MyApplicationState>{});

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule, FormsModule, NgReduxFormModule],
  providers: [provideReduxForms(store)],
  bootstrap: [MyApplicationComponent],
})
export class ExampleModule {}
```

The essential bit of code in the above samples is the call to `provideReduxForms(...)`.
This configures `@angular-redux/form` and provides access to your Redux store or NgRedux
instance. The shape of the object that `provideReduxForms` expects is very
basic:

```typescript
export interface AbstractStore<RootState> {
  /// Dispatch an action
  dispatch(action: Action & { payload? }): void;

  /// Retrieve the current application state
  getState(): RootState;

  /// Subscribe to changes in the store
  subscribe(fn: () => void): Redux.Unsubscribe;
}
```

Both `NgRedux<T>` and `Redux.Store<T>` conform to this shape. If you have a more
complicated use-case that is not covered here, you could even create your own store
shim as long as it conforms to the shape of `AbstractStore<RootState>`.

### How the bindings work

The bindings work by inspecting the shape of your form and then binding to a Redux
state object that has the same shape. The important element is `NgControl::path`.
Each control in an Angular 2 form has a computed property called `path` which uses
a very basic algorithm, ascending the tree from the leaf (control) to the root
(the `<form>` element) and returning an array containing the name of each group or
array in the path. So for example, let us take a look at this form that lets the
user provide their full name and the names and types of their children:

```html
<form connect="form1">
  <input ngControl ngModel name="fullname" type="text" />
  <template connectArray let-index connectArrayOf="dependents">
    <div [ngModelGroup]="index">
      <input ngControl ngModel name="fullname" type="text" />
      <select ngControl ngModel name="type">
        <option value="adopted">Adopted</option>
        <option value="biological">Biological child</option>
      </select>
    </div>
  </template>
</form>
```

Our root `<form>` element has a `connect` directive that points to the state element
`form1`. This means that the children within your form will all be bound to some
bit of state inside of the `form1` object in your Redux state. Then we have a child
input which is bound to a property called `fullname`. This is a basic text box. If
you were to inspect it in the debugger, it would have a `path` value like this:

```
['form1', 'fullname']
```

And therefore it would bind to this piece of Redux state:

```json
{
  "form1": {
    "fullname": "Chris Bond"
  }
}
```

So far so good. But look at the array element inside our form, in the `<template>`
element. It is bound to an array property called `dependents`. The elements inside
of the `<template>` tag contain the template that will be instantiated for each
element inside of the `dependents` array. The `ngModelGroup` specifies that we should
create a `FormGroup` element for each item in the array and the name of that group
should be the value of `index` (the zero-based index of the element that is being
rendered). This is important because it allows us to create a form structure that
matches our Redux state. Let's say our state looks like this:

```json
{
  "form1": {
    "fullname": "Chris Bond",
    "dependents": [
      {
        "fullname": "Christopher Bond Jr.",
        "type": "biological"
      }
    ]
  }
}
```

If you think about the 'path' to the first element of the dependents array, it would
be this:

```
['form1', 'dependents', 0]
```

The last element, `0`, is the index into the `dependents` array. This is our
`ngModelGroup` element. This allows us to create a form structure that has the
same structure as our Redux state. Therefore if we pause the debugger and look at
the `path` property on our first `<select>` element, it would look like this:

```
['form1', 'dependents', 0, 'type']
```

From there, `@angular-redux/form` is able to take that path and extract the value for
that element from the Redux state.

#### Reactive Forms

The value in "connect" attribute is the value that will show up in the Redux store. The formGroup value is the name of the object in your code that represents the form group.

```html
  <form connect="myForm" [formGroup]="loginForm">
    <input type="text" name="address" formControlName="firstName" />
  </form>
```

#### Troubleshooting

If you are having trouble getting data-binding to work for an element of your form,
it is almost certainly because the `path` property on your control does not match
the structure of your Redux state. Try pausing the debugger in `Connect::resetState`
and check the value of `path` on the control that has failed to bind. Then make sure
it is a valid path to the state in question.

### Reducers

The library will automatically bind your state to value of your form inputs. This is
the easy part and is unlikely to cause any problems for you. Slightly more difficult
is _updating your Redux state_ when the form values change. There are two approaches
that you can take in order to do this.

The first, and by far the simplest, is to use the reducer that comes with `@angular-redux/form`
and uses the value supplied in `connect` and the form input names in order to update
your Redux state automatically. If you do not need to do any special processing on
your data when the user updates form inputs, then you should use this default reducer.
To use it, you need to combine it with your existing reducers like so:

```typescript
import { composeReducers, defaultFormReducer } from '@angular-redux/form';

const reducer = composeReducers(
  defaultFormReducer(),
  combineReducers({
    foo: fooReducer,
    bar: barReducer,
  }),
);
```

The important bits of code here are the calls to `composeReducers` and `defaultFormReducer`.
The call to `composeReducers` essentially takes your existing reducer configuration and
chains them together with `defaultFormReducer`. The default form reducer only handles one
action, `{FORM_CHANGED}`. You can think of it like so:

```typescript
function defaultFormReducer(state, action: Redux.Action & {payload?}) {
  switch (action.type) {
    case FORM_CHANGED:
      [return new state with form values from action.payload];
    default:
      break;
  }
  return state;
}
```

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

The unit tests in `*.test.ts` files also contain useful examples of how to build
forms using `@angular-redux/form`.
