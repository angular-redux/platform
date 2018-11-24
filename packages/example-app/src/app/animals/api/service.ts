import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Animal, ANIMAL_TYPES, AnimalType, fromServer } from '../model';

// A fake API on the internets.
const URLS = {
  [ANIMAL_TYPES.ELEPHANT]: 'https://www.mocky.io/v2/59200c34110000ce1a07b598',
  [ANIMAL_TYPES.LION]: 'https://www.mocky.io/v2/5920141a25000023015998f2',
};

@Injectable()
export class AnimalAPIService {
  constructor(private http: HttpClient) {}

  getAll = (animalType: AnimalType): Observable<Animal[]> =>
    this.http
      .get<Animal[]>(URLS[animalType])
      .pipe(
        map(records => records.map(fromServer))
      );
}
