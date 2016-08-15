import { Iterable, Map as ImmutableMap } from 'immutable';

import { FormException } from './form-exception';

export interface Operations<T> {
  /// Shallow clone the object
  clone(): T;

  /// Clone and merge
  merge(key: number | string, value: T);

  /// Clone the object and update a specific key inside of it
  update(key: number | string, value: T);
}

export interface TraverseCallback {
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

        deepValue = transformed[k];

        Object.assign(parent, transformed);
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

  static get<State>(state: State, path: string[]): any {
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

    const operations = State.inspect(state);

    if (path.length === 0) {
      return operations.update(null, value);
    }

    const root = operations.clone();

    // We want to shallow clone the object, and then trace a path to the place
    // we want to update, cloning each object we traversed on our way and then
    // finally updating the value on the last parent to be @value. This seems
    // to offer the best performance: we can shallow clone everything that has
    // not been modified, and {deep clone + update} the path down to the value
    // that we wish to update.
    State.traverse(root, path,
      (parent, key: number | string, remainingPath: string[], innerValue?) => {
        const parentOperations = State.inspect(parent);

        if (innerValue) {
          return parentOperations.update(key,
            remainingPath.length > 0
              ? State.inspect(innerValue).clone()
              : value);
        }
        else {
          const getProbableType = (key: string | number) => {
            // NOTE(cbond): If your code gets here, you might not be using the library
            /// correctly. If you are assigning into a path in your state, try to
            /// ensure that there is a path to traverse, even if everything is just
            /// empty objects and arrays. If we have to guess the type of the containers
            /// and then create them ourselves, we may not get the types right. Use
            /// the Redux `initial state' construct to resolve this issue if you like.
            return typeof key === 'number'
              ? new Array()
              : Array.isArray(key)
                ? ImmutableMap()
                : new Object();
          };

          return parentOperations.update(key,
            remainingPath.length > 0
              ? getProbableType(remainingPath[0])
              : value);
        }
      });

    return root;
  }

  static inspect<K>(object: K): Operations<K> {
    const metaOperations = (update, merge, clone?) => {
      const operations = {
        /// Clone the object (shallow)
        clone: typeof clone === 'function'
          ? () => clone(<any> object) as any
          : () => object,

        /// Update a specific key inside of the container object
        update: (key: string, value: K) => update(operations.clone(), key, value),

        /// Merge existing values with new values
        merge: (key: string, value: K) => {
          const cloned = operations.clone();
          return merge(cloned, key, value, v => update(cloned, key, v));
        }
      };

      return operations;
    };

    if (Iterable.isIterable(object)) {
      return metaOperations(
        // Replace
        (parent, key: number | string, value: K) => {
          if (key != null) {
            return parent.set(key, value);
          }
          else {
            return value;
          }
        },
        // Merge
        (parent, key: number | string, value: K, setter: (v: K) => K) => {
          return setter(parent.concat(value));
        });
    }
    else if (Array.isArray(object)) {
      return metaOperations(
        // Replace array contents
        (parent, key: number, value: K) => {
          if (key != null) {
            parent[key] = value;
          }
          else {
            parent.splice.apply(parent, [0, parent.length]
              .concat(Array.isArray(value) ? value : [value]));
          }
        },

        // Merge
        (parent, key: number | string, value: K, setter: (v: K) => K) => {
          setter(parent.concat(value));
          return parent;
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
            parent.clear();
            m.forEach((value, index) => parent.set(index, value));
            return parent;
          }
        },

        // Merge
        (parent: Map<string, any>, key: number | string, value: K, setter: (v: K) => K) => {
          const m = new Map<string, any>(<any> value);
          m.forEach((value, key) => parent.set(key, value));
          return parent;
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

        // Merge
        (parent: Set<any>, key: number | string, value, setter: (v: K) => K) => {
          for (const element of value) {
            parent.add(element);
          }
          return parent;
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
             (parent, key: number | string, value: K, setter: (v: K) => K) => {
               for (const k of Object.keys(value)) {
                 parent[k] = value[k];
               }
               return parent;
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
