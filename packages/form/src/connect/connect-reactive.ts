import { Directive, Input } from '@angular/core';

import { FormStore } from '../form-store';

import { ConnectBase } from './connect-base';

// For reactive forms (without implicit NgForm)
@Directive({ selector: 'form[connect][formGroup]' })
export class ReactiveConnectDirective extends ConnectBase {
  @Input() formGroup: any;

  constructor(protected store: FormStore) {
    super();
  }
}
