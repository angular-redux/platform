import { Injectable } from '@angular/core';
import { combineEpics } from 'redux-observable';

import { ANIMAL_TYPES } from '../animals/model';
import { AnimalAPIEpics } from '../animals/api/epics';

@Injectable()
export class RootEpics {
  constructor(private animalEpics: AnimalAPIEpics) {}

  public createEpics() {
    return [
      this.animalEpics.createEpic(ANIMAL_TYPES.ELEPHANT),
      this.animalEpics.createEpic(ANIMAL_TYPES.LION),
    ];
  }
}
