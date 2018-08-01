import { Iterable, Map as ImmutableMap } from 'immutable';

import { FormException } from './form-exception';

export interface Operations<T> {
  /// Shallow clone the object
  clone(): T;

  /// Clone and merge
  merge(key: number | string | null, value: T): any;

  /// Clone the object and update a specific key inside of it
  update(key: number | string | null, value: T): any;
}

export type TraverseCallback = (
  parent: any,
  key: number | string,
  remainingPath: string[],
  value?: any,
) => any;

export abstract class State {
  static traverse<StateType>(
    state: StateType,
    path: string[],
    fn?: TraverseCallback,
  ) {
    let deepValue = state;

    for (const k of path) {
      const parent = deepValue;

      if (Iterable.isIterable(deepValue)) {
        const m = (deepValue as any) as ImmutableMap<string, any>;
        if (typeof m.get === 'function') {
          deepValue = m.get(k);
        } else {
          throw new FormException(
            `Cannot retrieve value from immutable nonassociative container: ${k}`,
          );
        }
      } else if (deepValue instanceof Map) {
        deepValue = ((deepValue as any) as Map<string, any>).get(k);
      } else {
        deepValue = (deepValue as any)[k];
      }

      if (typeof fn === 'function') {
        const transformed = fn(
          parent,
          k,
          path.slice(path.indexOf(k) + 1),
          deepValue,
        );

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

  static get<StateType>(state: StateType, path: string[]): any {
    return State.traverse(state, path);
  }

  static assign<StateType>(state: StateType, path: string[], value?: any) {
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
    State.traverse(
      root,
      path,
      (parent, key: number | string, remainingPath: string[], innerValue?) => {
        const parentOperations = State.inspect(parent);

        if (innerValue) {
          const innerOperations = State.inspect(innerValue);

          return parentOperations.update(
            key,
            remainingPath.length > 0
              ? innerOperations.clone()
              : innerOperations.merge(null, value),
          );
        } else {
          const getProbableType = (stateKey: string | number) => {
            // NOTE(cbond): If your code gets here, you might not be using the library
            /// correctly. If you are assigning into a path in your state, try to
            /// ensure that there is a path to traverse, even if everything is just
            /// empty objects and arrays. If we have to guess the type of the containers
            /// and then create them ourselves, we may not get the types right. Use
            /// the Redux `initial state' construct to resolve this issue if you like.
            return typeof stateKey === 'number'
              ? new Array()
              : Array.isArray(stateKey)
                ? ImmutableMap()
                : new Object();
          };

          return parentOperations.update(
            key,
            remainingPath.length > 0
              ? getProbableType(remainingPath[0])
              : value,
          );
        }
      },
    );

    return root;
  }

  static inspect<K>(object: K): Operations<K> {
    const metaOperations = (
      // TODO: Write proper type declarations for following Function types
      update: Function,
      merge: Function,
      clone?: Function,
    ) => {
      const operations = {
        /// Clone the object (shallow)
        clone:
          typeof clone === 'function'
            ? () => clone(object as any) as any
            : () => object,

        /// Update a specific key inside of the container object
        update: (key: string, value: K) =>
          update(operations.clone(), key, value),

        /// Merge existing values with new values
        merge: (key: string, value: K) => {
          const cloned = operations.clone();
          return merge(cloned, key, value, (v: any) => update(cloned, key, v));
        },
      };

      return operations;
    };

    if (Iterable.isIterable(object)) {
      return metaOperations(
        // Replace
        (parent: any, key: number | string, value: K) => {
          if (key != null) {
            return parent.set(key, value);
          } else {
            return value;
          }
        },
        // Merge
        (parent: any, key: number | string | string[], value: K) => {
          if (key) {
            return parent.mergeDeepIn(Array.isArray(key) ? key : [key], value);
          } else {
            if (ImmutableMap.isMap(value)) {
              return parent.mergeDeep(value);
            } else {
              return parent.concat(value);
            }
          }
        },
      );
    } else if (Array.isArray(object)) {
      return metaOperations(
        // Replace array contents
        (parent: any, key: number, value: K) => {
          if (key != null) {
            parent[key] = value;
          } else {
            parent.splice.apply(
              parent,
              [0, parent.length].concat(Array.isArray(value) ? value : [value]),
            );
          }
        },

        // Merge
        (parent: any, _: any, value: K, setter: (v: K) => K) => {
          setter(parent.concat(value));
          return parent;
        },

        // Clone
        () => Array.prototype.slice.call(object, 0),
      );
    } else if (object instanceof Map) {
      return metaOperations(
        // Update map key
        (parent: any, key: number | string, value: K) => {
          if (key != null) {
            return parent.set(key, value);
          } else {
            const m = new Map(value as any);
            parent.clear();
            m.forEach((mapValue, index) => parent.set(index, mapValue));
            return parent;
          }
        },

        // Merge
        (parent: Map<string, any>, _: any, value: K) => {
          const m = new Map<string, any>(value as any);
          m.forEach((mapValue, key) => parent.set(key, mapValue));
          return parent;
        },

        // Clone
        () =>
          object instanceof WeakMap
            ? new WeakMap<object, any>(object as any)
            : new Map<string, any>(object as any),
      );
    } else if (object instanceof WeakSet || object instanceof Set) {
      return metaOperations(
        // Update element at index in set
        (parent: any, key: number, value: K) => {
          if (key != null) {
            return parent.set(key, value);
          } else {
            const s = new Set(value as any);
            s.forEach((setValue, index) => parent.set(index, setValue));
            s.clear();
            return parent;
          }
        },

        // Merge
        (parent: Set<any>, _: any, value: any) => {
          for (const element of value) {
            parent.add(element);
          }
          return parent;
        },

        // Clone
        () =>
          object instanceof WeakSet
            ? new WeakSet<any>(object as any)
            : new Set<any>(object as any),
      );
    } else if (object instanceof Date) {
      throw new FormException(
        'Cannot understand why a Date object appears in the mutation path!',
      );
    } else {
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
            (parent: any, key: any, value: K) => {
              if (key != null) {
                return { ...parent, [key]: value };
              }
              return { ...parent, ...(value as any) };
            },
            (parent: any, _: any, value: K) => {
              for (const k of Object.keys(value)) {
                parent[k] = (value as any)[k];
              }
              return parent;
            },
            () => ({ ...(object as any) }),
          );
        default:
          break;
      }
    }

    throw new Error(
      `An object of type ${typeof object} has appeared in the mutation path! Every element ` +
        'in the mutation path should be an array, an associative container, or a set',
    );
  }

  static empty(value: any): boolean {
    return (
      value == null ||
      (value.length === 0 ||
        (typeof value.length === 'undefined' &&
          Object.keys(value).length === 0))
    );
  }
}
