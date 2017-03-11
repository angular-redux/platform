import { Injectable } from '@angular/core';
import { combineEpics } from 'redux-observable';

import { ANIMAL_TYPES } from '../animals/animal.types';
import { AnimalEpics } from '../animals/animal.epics';

@Injectable()
export class RootEpics {
  constructor(private animalEpics: AnimalEpics) {}

  public createEpics() {
    return [
      this.animalEpics.createEpic(ANIMAL_TYPES.ELEPHANT),
      this.animalEpics.createEpic(ANIMAL_TYPES.LION),
    ];
  }
}
