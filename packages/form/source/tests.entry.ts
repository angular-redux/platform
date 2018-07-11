import 'core-js/es6';
import 'core-js/es7/reflect';

import 'reflect-metadata';

import 'zone.js/dist/zone';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'zone.js/dist/proxy';
import 'zone.js/dist/jasmine-patch';

import { TestBed } from '@angular/core/testing';

import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

const testContext = (<{ context?: Function }>require).context(
  './',
  true,
  /^(.(?!tests\.entry))*\.ts$/,
);

testContext('./index.ts');

const tests = testContext.keys().filter(f => /\.test\.ts$/.test(f));

for (const test of tests) {
  testContext(test);
}
