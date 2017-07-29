import { Directive } from '@angular/core';

import { NgForm } from '@angular/forms';

import {FormStore} from '../form-store';
import {ConnectBase} from './connect-base';


// For template forms (with implicit NgForm)
@Directive({ selector: 'form[connect]:not([formGroup])' })
export class Connect extends ConnectBase {

  constructor(
    protected store: FormStore,
    protected form: NgForm
  ) {
    super();
  }
}
