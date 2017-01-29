import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// A fake API on the internets.
const ELEPHANTS_URL = 'http://www.mocky.io/v2/588d70ad100000e50f2d2983';

@Injectable()
export class ElephantsService {
  constructor(private http: Http) {}

  getAll() {
    return this.http.get(ELEPHANTS_URL)
      .map(resp => resp.json())
      .map(records => records.map(
        record => ({
          animalType: record.type,
          name: record.name,
        })));
  }
}
