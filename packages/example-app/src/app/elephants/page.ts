import { select, select$ } from '@angular-redux/store';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { pipe, prop, sortBy, values } from 'ramda';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { AnimalAPIActions } from '../animals/api/actions';
import { Animal, ANIMAL_TYPES } from '../animals/model';

export const sortAnimals = (animalDictionary$: Observable<{}>) =>
  animalDictionary$.pipe(
    map(
      pipe(
        values,
        sortBy(prop('name')),
      ),
    ),
  );

@Component({
  templateUrl: './page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElephantPageComponent {
  // Get elephant-related data out of the Redux store as observables.
  @select$(['elephant', 'items'], sortAnimals)
  readonly animals$: Observable<Animal[]>;

  @select(['elephant', 'loading'])
  readonly loading$: Observable<boolean>;

  @select(['elephant', 'error'])
  readonly error$: Observable<any>;

  constructor(actions: AnimalAPIActions) {
    actions.loadAnimals(ANIMAL_TYPES.ELEPHANT);
  }
}
