import { Component, ChangeDetectionStrategy } from '@angular/core';
import { select, select$ } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { pipe, values, sortBy, prop } from 'ramda';

import { AnimalAPIActions } from '../animals/api/actions';
import { ANIMAL_TYPES, IAnimal } from '../animals/model';

export const sortAnimals = (animalDictionary$: Observable<{}>) =>
  animalDictionary$.map(
    pipe(
      values,
      sortBy(prop('name'))));

@Component({
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LionPageComponent {
  // Get lion-related data out of the Redux store as observables.
  @select$(['lion', 'items'], sortAnimals)
  readonly animals$: Observable<IAnimal[]>;

  @select(['lion', 'loading'])
  readonly loading$: Observable<boolean>;

  @select(['lion', 'error'])
  readonly error$: Observable<any>;

  constructor(actions: AnimalAPIActions) {
    actions.loadAnimals(ANIMAL_TYPES.LION);
  }
}
