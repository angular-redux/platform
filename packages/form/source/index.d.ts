///<reference path="../typings/modules/immutable/index.d.ts" />
///<reference path="../typings/globals/redux/index.d.ts" />
///<reference path="../node_modules/ng2-redux/lib/index.d.ts" />

declare module "ng2-redux-form" {
  /**
   * Compose a reducer function from several other reducer functions. There are several things
   * happening when you use the composeReducers function. First, each of the reducers are
   * invoked with an undefined first argument and an empty action argument, so that we may
   * query that reducer for its initial state. Then each of these initial states are combined
   * together to produce a true initial state.
   *
   * Then we return a reducer function which essentially invokes each of the reducers in the
   * order that they were provided, each receiving the state object returned from the prior
   * reducer invocation.
   *
   * ## Usage
   *
   * (Note that in a real usage scenario, you would typically have a reducer that would contain
   * a switch statement and some logic that processes the action given to it. But this is just
   * to illustrate how you use the function, not how to build a reducer.)
   *
   * ```typescript
   * const reducer1 = (state = {a: 1}, action: Redux.Action) => state;
   * const reducer2 = (state = {b: 1}, action: Redux.Action) => state;
   * const reducer = composeReducers(reducer1, reducer2);
   * ```
   */
  export function composeReducers<State>(...reducers: Redux.Reducer<State>[]): Redux.Reducer<State>;

  /**
   * The Connect directive is the glue that connects Redux to a form. The [connect] directive
   * itself can only be applied to <form> elements. The most typical usage scenario will have
   * you specify a path to the state that you wish to bind to the form, for example:
   *
   * ```typesecript
   * <form [connect]="['applicant', 'finances']">
   *   <input type="number" name="income" ngControl ngModel />
   * </form>
   * ```
   */
  export class Connect<RootState> { }

  import { NgRedux } from 'ng2-redux';
  
  /**
   * Provide all of the internal ng2-redux-form dependencies to bootstrap() or
   * beforeEachProviders(). It accepts either a Redux store or an NgRedux object
   * that itself is managing a Redux store.
   */
  export function provideFormConnect<T>(arg: Redux.Store<T> | NgRedux<T>);
}
