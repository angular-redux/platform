import 'core-js/es6';
import 'core-js/es7/reflect';
import 'ts-helpers';
import 'zone.js/dist/zone';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'zone.js/dist/jasmine-patch';

import {setBaseTestProviders} from '@angular/core/testing';

import {
  TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
  TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS
} from '@angular/platform-browser-dynamic/testing';

setBaseTestProviders(
  TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
  TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);

const testContext = (<{ context?: Function }>require)
  .context('./', true, /^(.(?!tests\.entry))*\.ts$/);

testContext('./index.ts');

const tests = testContext.keys().filter(f => /\.test\.ts$/.test(f));

for (const test of tests) {
  testContext(test);
}
