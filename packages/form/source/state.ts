import { Iterable, Map as ImmutableMap } from 'immutable';

import { FormException } from './form-exception';

export abstract class State {
  static get<State>(original: State, path: string[]) {
    let deepValue = original;

    for (const k of path) {
      if (Iterable.isIterable(deepValue)) {
        const m = <ImmutableMap<string, any>> <any> deepValue;
        if (typeof m.get === 'function') {
           deepValue = m.get(k);
        }
        else {
          throw new FormException(`Cannot retrieve value from immutable nonassociative container: ${k}`);
        }
      }
      else if (deepValue instanceof Map) {
        deepValue = (<Map<string, any>> <any> deepValue).get(k);
      }
      else {
        deepValue = deepValue[k];
      }

      // If we were not able to find this state inside of our root state
      // structure, then we return undefined -- not null -- to indicate that
      // state. But this could be a perfectly normal use-case so we don't
      // want to throw an exception or anything along those lines.
      if (deepValue === undefined) {
        return undefined;
      }
    }

    return deepValue;
  }

  static assign<State>(original: State, path: string[], value?) {
    if (State.empty(original)) {
      return value;
    }
    else if (State.empty(value)) {
      return original;
    }
    else if (path.length === 0) {
      return Object.assign({}, original, value);
    }

    let deepValue: any = original;
    for (const c of path) {
      if (Iterable.isIterable(deepValue)) {
        deepValue = deepValue.get(c);
      }
      else if (deepValue.hasOwnProperty(c)) {
        deepValue = deepValue[c];
      }
      else {
        deepValue = undefined;
      }

      // resolve elements of the state that are functions
      if (typeof deepValue === 'function') {
        deepValue = deepValue();
      }

      if (deepValue == null) {
        break;
      }
    }

    if (deepValue == null) {
      return Object.assign({}, value);
    }
    else if (Iterable.isIterable(deepValue)) {
      if (typeof deepValue.merge === 'function') {
        return deepValue.merge(value);
      }
      else if (typeof deepValue.concat === 'function') {
        return deepValue.concat(value);
      }
      throw new FormException('Cannot merge or concatenate state objects');
    }

    return Object.assign({}, deepValue, value);
  }

  static empty(value): boolean {
    return value == null
      || (value.length === 0
      || (typeof value.length === 'undefined' && Object.keys(value).length === 0));
  }
}