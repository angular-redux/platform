import 'reflect-metadata';

import 'babel-polyfill';

import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {ExampleModule} from './module';

platformBrowserDynamic().bootstrapModule(ExampleModule);
