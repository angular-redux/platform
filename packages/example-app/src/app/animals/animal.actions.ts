import { Injectable } from '@angular/core';
import { Action } from 'redux';

@Injectable()
export class AnimalActions {
  static readonly LOAD_STARTED = 'LOAD_STARTED';
  static readonly LOAD_SUCCEEDED = 'LOAD_SUCCEEDED';
  static readonly LOAD_FAILED = 'LOAD_FAILED';

  loadAnimals(animalType) {
    return {
      type: AnimalActions.LOAD_STARTED,
      meta: { animalType },
    };
  }

  loadSucceeded(animalType, payload) {
    return {
      type: AnimalActions.LOAD_SUCCEEDED,
      meta: { animalType },
      payload,
    };
  }

  loadFailed(animalType, error) {
    return {
      type: AnimalActions.LOAD_FAILED,
      meta: { animalType },
      error,
    };
  }
}
