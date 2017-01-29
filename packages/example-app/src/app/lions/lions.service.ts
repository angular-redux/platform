import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// A fake API on the internets.
const LIONS_URL = 'http://www.mocky.io/v2/588d702d100000d50f2d2980';

@Injectable()
export class LionsService {
  constructor(private http: Http) {}

  getAll() {
    return this.http.get(LIONS_URL)
      .map(resp => resp.json())
      .map(records => records.map(
        record => ({
          animalType: record.type,
          name: record.name,
        })));
  }
}
