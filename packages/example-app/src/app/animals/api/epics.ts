import { Injectable } from '@angular/core';
import { Epic, createEpicMiddleware } from 'redux-observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/startWith';

import { IAppState } from '../../store/model';
import { AnimalType } from '../model';
import { AnimalAPIAction, AnimalAPIActions } from './actions';
import { AnimalAPIService } from './service';

const animalsNotAlreadyFetched = (
  animalType: AnimalType,
  state: IAppState): boolean => !(
    state[animalType] &&
    state[animalType].items &&
    Object.keys(state[animalType].items).length);

const actionIsForCorrectAnimalType = (animalType: AnimalType) =>
  (action: AnimalAPIAction): boolean =>
    action.meta.animalType === animalType;

@Injectable()
export class AnimalAPIEpics {
  constructor(
    private service: AnimalAPIService,
    private actions: AnimalAPIActions,
  ) {}

  public createEpic(animalType: AnimalType) {
    return createEpicMiddleware(this.createLoadAnimalEpic(animalType));
  }

  private createLoadAnimalEpic(animalType: AnimalType): Epic<AnimalAPIAction, IAppState> {
    return (action$, store) => action$
      .ofType(AnimalAPIActions.LOAD_ANIMALS)
      .filter(action => actionIsForCorrectAnimalType(animalType)(action))
      .filter(() => animalsNotAlreadyFetched(animalType, store.getState()))
      .switchMap(() => this.service.getAll(animalType)
        .map(data => this.actions.loadSucceeded(animalType, data))
        .catch(response => of(this.actions.loadFailed(animalType, {
          status: '' + response.status,
        })))
        .startWith(this.actions.loadStarted(animalType)));
  }
}
