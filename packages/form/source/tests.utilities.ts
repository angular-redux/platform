import { tick, flushMicrotasks } from '@angular/core/testing';

import { Iterable } from 'immutable';

const keysim = require('keysim');

const createLogger = require('redux-logger');

// Preferred keyboard layout when simulating typing into form fields
const keyboard = keysim.Keyboard.US_ENGLISH;

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

export const drainQueue = () => {
  tick();

  flushMicrotasks();
};

export const simulateUserTyping = (control: HTMLInputElement, text: string) => {
  if (keyboard == null) {
    throw new Error('No default keyboard layout has been configured for unit tests');
  }

  keyboard.dispatchEventsForInput(text, control);

  drainQueue();
};