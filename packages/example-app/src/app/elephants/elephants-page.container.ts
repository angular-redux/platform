import { Component } from '@angular/core';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

/**
 * In Redux terminology, a 'container' is a component that knows about the store.
 * It selects data, and marshals it into a set of 'presentational' (or non-redux-connected)
 * components for display.
 *
 * The 'page-level' components that get attached to the router are usually containers;
 * but not all containers need to be page-level components.
 */
@Component({
  template: `
    <zoo-animal-list
      animalsName="Elephants"
      [animals]="animals$"
      [loading]="loading$"
      [error]="error$">
    </zoo-animal-list>
  `
})
export class ElephantsPageComponent {
  // Shorthand for
  // constructor(ngRedux: NgRedux {
  //  this.animals$ = ngRedux.select(['elephants', 'items']);
  // })
  @select(['elephants', 'items']) readonly animals$: Observable<any[]>;
  @select(['elephants', 'loading']) readonly loading$: Observable<boolean>;
  @select(['elephants', 'error']) readonly error$: Observable<any>;
}
