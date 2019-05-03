import { Action } from 'redux';

import { NgRedux } from '../components/ng-redux';
import { getBaseStore } from './helpers';

/**
 * Auto-dispatches the return value of the decorated function.
 *
 * Decorate a function creator method with @dispatch and its return
 * value will automatically be passed to ngRedux.dispatch() for you.
 */
export function dispatch(): PropertyDecorator {
  return function decorate(
    target: object,
    key: string | symbol | number,
    descriptor?: PropertyDescriptor,
  ): PropertyDescriptor {
    let originalMethod: () => Action;

    const wrapped = function(this: unknown, ...args: any) {
      const result = originalMethod.apply(this, args);
      if (result !== undefined) {
        const store = getBaseStore(this) || NgRedux.instance;
        if (store) {
          store.dispatch(result);
        }
      }
      return result;
    };

    descriptor = descriptor || Object.getOwnPropertyDescriptor(target, key);

    if (descriptor === undefined) {
      const dispatchDescriptor: PropertyDescriptor = {
        get: () => wrapped,
        set: setMethod => (originalMethod = setMethod),
      };
      Object.defineProperty(target, key, dispatchDescriptor);
      return dispatchDescriptor;
    } else {
      originalMethod = descriptor.value;
      descriptor.value = wrapped;
      return descriptor;
    }
  };
}
// get descriptor
// if no descriptor, create one with getter setter
// if descriptor, set original method to descriptor, and then bind the wrapped function instead
