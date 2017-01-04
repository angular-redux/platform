import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// A fake API on the internets.
const BASE_URL = 'http://jsonplaceholder.typicode.com';

@Injectable()
export class LionsService {
  constructor(private http: Http) {}

  getAll() {
    return this.http.get(BASE_URL + '/users')
      .map(resp => resp.json())
      .map(records => records.map(
        record => ({
          animalType: 'Lion',
          name: record.name.split(' ')[0],
        })));
  }
}
