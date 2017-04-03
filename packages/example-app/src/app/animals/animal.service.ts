import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { ANIMAL_TYPES, AnimalType } from '../animals/animal.types';

// A fake API on the internets.
const URLS = {
  [ANIMAL_TYPES.LION]: 'http://www.mocky.io/v2/588d70ad100000e50f2d2983',
  [ANIMAL_TYPES.ELEPHANT]: 'http://www.mocky.io/v2/588d702d100000d50f2d2980',
};

@Injectable()
export class AnimalService {
  constructor(private http: Http) {}

  getAll(animalType: AnimalType) {
    return this.http.get(URLS[animalType])
      .map(resp => resp.json())
      .map(records => records.map(
        record => ({
          animalType,
          name: record.name,
        })));
  }
}
