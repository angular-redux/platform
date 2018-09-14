import { flushMicrotasks } from '@angular/core/testing';

import { Iterable } from 'immutable';

import { createLogger } from 'redux-logger';

export const logger = createLogger({
  level: 'debug',
  collapsed: true,
  predicate: (getState, action) => true,
  stateTransformer: state => {
    const newState = new Object();

    for (const i of Object.keys(state)) {
      newState[i] = Iterable.isIterable(state[i]) ? state[i].toJS() : state[i];
    }

    return newState;
  },
});

export const simulateUserTyping = (control, text: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      dispatchKeyEvents(control, text);
      resolve();
    } catch (error) {
      console.error('Failed to dispatch typing events', error);
      reject(error);
    } finally {
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
      return new Event(eventType, {
        bubbles: true,
        cancelable: false,
      });
    };

    control.dispatchEvent(keyboardEventFactory('keydown', c));
    control.dispatchEvent(keyboardEventFactory('keypress', c));
    control.dispatchEvent(keyboardEventFactory('keyup', c));
    control.value += character;
    control.dispatchEvent(eventFactory('input'));
  }
};
