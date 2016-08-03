import { NgZone } from '@angular/core';
import { flushMicrotasks } from '@angular/core/testing';

import { Iterable } from 'immutable';

const createLogger = require('redux-logger');

declare const __DEV__: boolean;

export const logger = createLogger({
  level: 'debug',
  collapsed: true,
  predicate: (getState, action) => __DEV__ === true,
  stateTransformer: (state) => {
    let newState = {};
    for (let i of Object.keys(state)) {
      if (Iterable.isIterable(state[i])) {
        newState[i] = state[i].toJS();
      } else {
        newState[i] = state[i];
      }
    };
    return newState;
  }
});

export const simulateUserTyping = (ngZone: NgZone, control, text: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      dispatchKeyEvents(control, text);
      resolve();
    } catch (error) {
      console.error('Failed to dispatch typing events', error);
      reject(error);
    }
    finally {
      flushMicrotasks();
    }
  });
};

export const dispatchKeyEvents = (control, text: string) => {
  if (!text) {
    return;
  }

  control.focus();

  for (const character of text) {
    const c = character.charCodeAt(0);

    const keyboardEventFactory = (eventType: string, value) => {
      return new KeyboardEvent(eventType, {
        altKey: false,
        cancelable: false,
        bubbles: true,
        ctrlKey: false,
        metaKey: false,
        detail: value,
        view: window,
        shiftKey: false,
        repeat: false,
        key: value,
      });
    };

    const eventFactory = (eventType: string) => {
      return new Event('input', {
        bubbles: true,
        cancelable: false,
      });
    }

    control.dispatchEvent(keyboardEventFactory('keydown', c));
    control.dispatchEvent(keyboardEventFactory('keypress', c));
    control.dispatchEvent(keyboardEventFactory('keyup', c));
    control.value += character;
    control.dispatchEvent(eventFactory('input'));
  }
};