import { Injectable } from '@angular/core';

import { FluxStandardAction } from 'flux-standard-action';
import { combineEpics, Epic } from 'redux-observable';

import { AnimalAPIEpics } from '../animals/api/epics';
import { ANIMAL_TYPES } from '../animals/model';
import { AppState } from './model';

@Injectable()
export class RootEpics {
  constructor(private animalEpics: AnimalAPIEpics) {}

  createEpics() {
    return combineEpics(
      this.animalEpics.createEpic(ANIMAL_TYPES.ELEPHANT),
      this.animalEpics.createEpic(ANIMAL_TYPES.LION),
    );
  }
}
