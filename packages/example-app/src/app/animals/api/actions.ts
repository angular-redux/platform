import { Injectable } from '@angular/core';
import { dispatch } from '@angular-redux/store';
import { FluxStandardAction } from 'flux-standard-action';
import { IAnimal, AnimalType } from '../model';

// Flux-standard-action gives us stronger typing of our actions.
type Payload = IAnimal[];
interface MetaData { animalType: AnimalType; };
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
    payload: null,
  });

  loadStarted = (animalType: AnimalType): AnimalAPIAction => ({
    type: AnimalAPIActions.LOAD_STARTED,
    meta: { animalType },
    payload: null,
  })

  loadSucceeded = (animalType: AnimalType, payload: Payload): AnimalAPIAction => ({
    type: AnimalAPIActions.LOAD_SUCCEEDED,
    meta: { animalType },
    payload,
  })

  loadFailed = (animalType: AnimalType, error): AnimalAPIAction => ({
    type: AnimalAPIActions.LOAD_FAILED,
    meta: { animalType },
    payload: null,
    error,
  })
}
