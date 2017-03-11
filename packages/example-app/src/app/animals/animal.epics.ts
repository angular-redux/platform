import { Injectable } from '@angular/core';
import { Epic, createEpicMiddleware } from 'redux-observable';
import { Action, Store } from 'redux';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AnimalType, ANIMAL_TYPES } from '../animals/animal.types';
import { AnimalActions } from '../animals/animal.actions';
import { AnimalService } from './animal.service';

@Injectable()
export class AnimalEpics {
  constructor(
    private service: AnimalService,
    private actions: AnimalActions,
  ) {}

  public createEpic(animalType: AnimalType) {
    return createEpicMiddleware(this.createLoadAnimalEpic(animalType));
  }

  private createLoadAnimalEpic(animalType) {
    return action$ => action$
      .ofType(AnimalActions.LOAD_STARTED)
      .filter(({ meta }) => meta.animalType === animalType)
      .switchMap(a => this.service.getAll(animalType)
        .map(data => this.actions.loadSucceeded(animalType, data))
        .catch(response => of(this.actions.loadFailed(animalType, {
          status: '' + response.status,
        }))));
  }
}
