// tslint:disable:no-implicit-dependencies
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'zone.js';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'zone.js/dist/proxy';
import 'zone.js/dist/sync-test';
// This must be loaded in after ZoneJS
// tslint:disable-next-line:ordered-imports
import 'jest-zone-patch';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

getTestBed().initTestEnvironment(
  [BrowserDynamicTestingModule, NoopAnimationsModule],
  platformBrowserDynamicTesting(),
);
