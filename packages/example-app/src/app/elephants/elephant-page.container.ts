import { Component, ChangeDetectionStrategy } from '@angular/core';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { NgRedux } from '@angular-redux/store';
import { AnimalActions } from '../animals/animal.actions';
import { ANIMAL_TYPES } from '../animals/animal.types';
import { IAppState } from '../store/root.types';

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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElephantPageComponent {
  // Get elephant-related data out of the Redux store as observables.
  @select(['elephants', 'items']) readonly animals$: Observable<any[]>;
  @select(['elephants', 'loading']) readonly loading$: Observable<boolean>;
  @select(['elephants', 'error']) readonly error$: Observable<any>;

  constructor(
    ngRedux: NgRedux<IAppState>,
    actions: AnimalActions) {
    ngRedux.dispatch(actions.loadAnimals(ANIMAL_TYPES.ELEPHANT));
  }
}
