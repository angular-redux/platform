// TODO: See if this linting rule can be enabled with new build process (ng-packagr)
// tslint:disable:no-implicit-dependencies
import { DevToolsExtension } from '@angular-redux/store';
import { Injectable } from '@angular/core';

@Injectable()
export class MockDevToolsExtension extends DevToolsExtension {}
