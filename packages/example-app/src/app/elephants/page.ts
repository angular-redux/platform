import { Component, ChangeDetectionStrategy } from '@angular/core';
import { select, select$ } from '@angular-redux/store';
import { pipe, values, sortBy, prop } from 'ramda';
import { Observable } from 'rxjs/Observable';

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
export class ElephantPageComponent {
  // Get elephant-related data out of the Redux store as observables.
  @select$(['elephant', 'items'], sortAnimals)
  readonly animals$: Observable<IAnimal[]>;

  @select(['elephant', 'loading'])
  readonly loading$: Observable<boolean>;

  @select(['elephant', 'error'])
  readonly error$: Observable<any>;

  constructor(actions: AnimalAPIActions) {
    actions.loadAnimals(ANIMAL_TYPES.ELEPHANT);
  }
}
