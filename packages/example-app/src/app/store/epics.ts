import { Injectable } from '@angular/core';

import { AnimalAPIEpics } from '../animals/api/epics';
import { ANIMAL_TYPES } from '../animals/model';

@Injectable()
export class RootEpics {
  constructor(private animalEpics: AnimalAPIEpics) {}

  createEpics() {
    return [
      this.animalEpics.createEpic(ANIMAL_TYPES.ELEPHANT),
      this.animalEpics.createEpic(ANIMAL_TYPES.LION),
    ];
  }
}
