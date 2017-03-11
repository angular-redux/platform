import { Component, ChangeDetectionStrategy } from '@angular/core';
import { select, NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

import { AnimalActions } from '../animals/animal.actions';
import { ANIMAL_TYPES, IAnimal } from '../animals/animal.types';
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
      animalsName="Lions"
      [animals]="animals$"
      [loading]="loading$"
      [error]="error$">
    </zoo-animal-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LionPageComponent {
  // Get lion-related data out of the Redux store as observables.
  @select(['lions', 'items']) readonly animals$: Observable<IAnimal[]>;
  @select(['lions', 'loading']) readonly loading$: Observable<boolean>;
  @select(['lions', 'error']) readonly error$: Observable<any>;

  constructor(
    store: NgRedux<IAppState>,
    actions: AnimalActions) {
    store.dispatch(actions.loadAnimals(ANIMAL_TYPES.LION));
  }
}
