import 'reflect-metadata';
import 'babel-polyfill';
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'ts-helpers';

import { provideRouter } from '@angular/router';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { Component } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';

import { NgRedux } from 'ng2-redux';

@Component({
  selector: 'example',
  template: `
    <div>Hello!</div>
  `
})
export class Example {}

bootstrap(Example, []);
