import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';
import 'rxjs/add/operator/combineLatest';

export function counter(state) {
  return state.counter;
}

export function counterX2(state) {
  return state.counter * 2;
}

@Component({
  selector: 'counter-info',
  template: `
  <ul>
     <li>{{ funcCounter$ | async }}</li>
     <li>{{ stringKey$ | async }}</li>
     <li>{{ counterX2$ | async }}</li>
     <li>{{ foo?.x }} - {{ foo?.y }}</li>
  <ul>
  `
})
export class CounterInfo {

    @select(counter) funcCounter$;
    @select('counter') stringKey$;
    @select(counterX2) counterX2$: Observable<any>;
    foo: any;

    ngOnInit() {
        this.counterX2$.combineLatest(this.stringKey$, (x: any, y: any) => {
            return { x: x * 2, y: y * 3 };
        }).subscribe(n => {
            this.foo = n;
        })
    }
}
