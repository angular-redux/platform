import { dispatch } from '@angular-redux/store';
import { Injectable } from '@angular/core';
import { FluxStandardAction } from 'flux-standard-action';
import { Animal, AnimalType } from '../model';

// Flux-standard-action gives us stronger typing of our actions.
type Payload = Animal[];
interface MetaData {
  animalType: AnimalType;
}
export type AnimalAPIAction = FluxStandardAction<Payload, MetaData>;

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
    payload: undefined,
  });

  loadStarted = (animalType: AnimalType): AnimalAPIAction => ({
    type: AnimalAPIActions.LOAD_STARTED,
    meta: { animalType },
    payload: undefined,
  });

  loadSucceeded = (
    animalType: AnimalType,
    payload: Payload,
  ): AnimalAPIAction => ({
    type: AnimalAPIActions.LOAD_SUCCEEDED,
    meta: { animalType },
    payload,
  });

  loadFailed = (animalType: AnimalType, error: any): AnimalAPIAction => ({
    type: AnimalAPIActions.LOAD_FAILED,
    meta: { animalType },
    payload: undefined,
    error: !!error,
  });
}
