import { Directive, Inject, Input } from '@angular/core';
import { NgForm, NgControl } from '@angular/forms';

@Directive({
  selector: 'form[connect]',
})
export class ConnectForm {
  @Input('connect') private path: string;

  constructor(@Inject(NgForm) private form: NgForm) {}

  private ngOnChanges() {
    debugger;
  }
}