import { dispatch } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { FluxStandardAction } from 'flux-standard-action';

import { Animal, AnimalError, AnimalType } from '../model';

// Flux-standard-action gives us stronger typing of our actions.
export type Payload = Animal[] | AnimalError;

export interface MetaData {
  animalType: AnimalType;
}

export type AnimalAPIAction<T extends Payload = Animal[]> = FluxStandardAction<
  T,
  MetaData
>;

@Injectable()
export class AnimalAPIActions {
  static readonly LOAD_ANIMALS = 'LOAD_ANIMALS';
  static readonly LOAD_STARTED = 'LOAD_STARTED';
  static readonly LOAD_SUCCEEDED = 'LOAD_SUCCEEDED';
  static readonly LOAD_FAILED = 'LOAD_FAILED';

  @dispatch()
  loadAnimals = (animalType: AnimalType): AnimalAPIAction => ({
    type: AnimalAPIActions.LOAD_ANIMALS,
    meta: { animalType },
  });

  loadStarted = (animalType: AnimalType): AnimalAPIAction => ({
    type: AnimalAPIActions.LOAD_STARTED,
    meta: { animalType },
  });

  loadSucceeded = (
    animalType: AnimalType,
    payload: Animal[],
  ): AnimalAPIAction<Animal[]> => ({
    type: AnimalAPIActions.LOAD_SUCCEEDED,
    meta: { animalType },
    payload,
  });

  loadFailed = (
    animalType: AnimalType,
    error: AnimalError,
  ): AnimalAPIAction<AnimalError> => ({
    type: AnimalAPIActions.LOAD_FAILED,
    meta: { animalType },
    payload: error,
    error: true,
  });
}
