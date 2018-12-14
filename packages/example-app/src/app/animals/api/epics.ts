import { Injectable } from '@angular/core';
import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, filter, map, startWith, switchMap } from 'rxjs/operators';

import { AppState } from '../../store/model';
import { AnimalType } from '../model';
import { AnimalAPIAction, AnimalAPIActions } from './actions';
import { AnimalAPIService } from './service';

const animalsNotAlreadyFetched = (
  animalType: AnimalType,
  state: AppState,
): boolean =>
  !(
    state[animalType] &&
    state[animalType].items &&
    Object.keys(state[animalType].items).length
  );

const actionIsForCorrectAnimalType = (animalType: AnimalType) => (
  action: AnimalAPIAction,
): boolean => !!action.meta && action.meta.animalType === animalType;

@Injectable()
export class AnimalAPIEpics {
  constructor(
    private service: AnimalAPIService,
    private actions: AnimalAPIActions,
  ) {}

  createEpic(animalType: AnimalType) {
    return this.createLoadAnimalEpic(animalType);
  }

  private createLoadAnimalEpic(
    animalType: AnimalType,
  ): Epic<AnimalAPIAction, AnimalAPIAction, AppState> {
    return (action$, store$) =>
      action$.pipe(
        ofType(AnimalAPIActions.LOAD_ANIMALS),
        filter(action => actionIsForCorrectAnimalType(animalType)(action)),
        filter(() => animalsNotAlreadyFetched(animalType, store$.value)),
        switchMap(() =>
          this.service.getAll(animalType).pipe(
            map(data => this.actions.loadSucceeded(animalType, data)),
            catchError(response =>
              of(
                this.actions.loadFailed(animalType, {
                  status: '' + response.status,
                }),
              ),
            ),
            startWith(this.actions.loadStarted(animalType)),
          ),
        ),
      );
  }
}
