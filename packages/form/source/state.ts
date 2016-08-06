import { Iterable, Map as ImmutableMap } from 'immutable';

import { FormException } from './form-exception';

interface Operations<T> {
  /// Shallow clone the object
  clone(): T;

  /// Clone the object and update a specific key inside of it
  update(key: number | string, value: T);
}

interface TraverseCallback {
  (parent, key: number | string, remainingPath: string[], value?);
}

export abstract class State {
  static traverse<State>(state: State, path: string[], fn?: TraverseCallback) {
    let deepValue = state;

    for (const k of path) {
      const parent = deepValue;

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

      if (typeof fn === 'function') {
        const transformed = fn(parent, k, path.slice(path.indexOf(k) + 1), deepValue);

        if (transformed !== undefined) {
          parent[k] = deepValue = transformed[k];
        }
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

  static get<State>(state: State, path: string[]) {
    return State.traverse(state, path);
  }

  static assign<State>(state: State, path: string[], value?) {
    interface Modifiable {
      key: string;
      operations: {
        clone<T>(): T;
        update<T, V>(key: number | string, value: V): T;
      };
    };

    const root = State.inspect(state).clone();

    // We want to shallow clone the object, and then trace a path to the place
    // we want to update, cloning each object we traversed on our way and then
    // finally updating the value on the last parent to be @value. This seems
    // to offer the best performance: we can shallow clone everything that has
    // not been modified, and {deep clone + update} the path down to the value
    // that we wish to update.
    State.traverse(root, path,
      (parent, key: number | string, remainingPath: string[], innerValue?) => {
        const parentOperations = State.inspect(parent);

        const childOperations = State.inspect(innerValue);

        return parentOperations.update(key,
          remainingPath.length > 0
            ? childOperations.clone()
            : childOperations.update(null, value));
      });

    return root;
  }

  static inspect<K>(object: K): Operations<K> {
    const metaOperations = (update, clone?) => {
      const wrappedClone = typeof clone === 'function'
        ? () => clone(<any> object) as any
        : () => object;

      const wrappedUpdate =
        (key: string, value: K) => update(wrappedClone(), key, value);

      return {
        /// Clone the object (shallow)
        clone: wrappedClone,

        /// Update a specific key inside of the container object
        update: wrappedUpdate
      };
    };

    if (Iterable.isIterable(object)) {
      return metaOperations(
        (parent, key: number | string, value: K) => {
          if (key != null) {
            return parent.set(key, value);
          }
          else {
            return parent.concat(value);
          }
        });
    }
    else if (object instanceof Array) {
      return metaOperations(
        // Splice array
        (parent, key: number | string, value: K) => {
          if (key != null) {
            return parent.splice(key, 1, [value]);
          }
          else {
            for (const v of (<any>value)) {
              parent.push(v);
            }
            return parent;
          }
        },

        // Clone
        () => Array.prototype.slice.call(object, 0)
      );
    }
    else if (object instanceof WeakMap || object instanceof Map) {
      return metaOperations(
        // Update map key
        (parent, key: number | string, value: K) => {
          if (key != null) {
            return parent.set(key, value);
          }
          else {
            const m = new Map(<any> value);
            m.forEach((value, index) => parent.set(index, value));
            m.clear();
            return parent;
          }
        },

        // Clone
        () => object instanceof WeakMap
          ? new WeakMap<string, any>(<any> object)
          : new Map<string, any>(<any> object)
      );
    }
    else if (object instanceof WeakSet || object instanceof Set) {
      return metaOperations(
        // Update element at index in set
        (parent, key: number, value: K) => {
          if (key != null) {
            return parent.set(key, value);
          }
          else {
            const s = new Set(<any> value);
            s.forEach((value, index) => parent.set(index, value));
            s.clear();
            return parent;
          }
        },

        // Clone
        () => object instanceof WeakSet
          ? new WeakSet<any>(<any> object)
          : new Set<any>(<any> object)
       );
     }
     else if (object instanceof Date) {
       throw new FormException('Cannot understand why a Date object appears in the mutation path!');
     }
     else {
       switch (typeof object) {
         case 'boolean':
         case 'function':
         case 'number':
         case 'string':
         case 'symbol':
         case 'undefined':
           break;
         case 'object':
           if (object == null) {
             break;
           }
           return metaOperations(
             (parent, key, value: K) => {
               if (key != null) {
                 return Object.assign(parent, {[key]: value});
               }
                return Object.assign(parent, value);
             },
             () => Object.assign({}, object)
           )
          default:
            break;
       }
     }

     throw new Error(
       `An object of type ${typeof object} has appeared in the mutation path! Every element ` +
       'in the mutation path should be an array, an associative container, or a set');
  }

  static empty(value): boolean {
    return value == null
      || (value.length === 0
      || (typeof value.length === 'undefined' && Object.keys(value).length === 0));
  }
}