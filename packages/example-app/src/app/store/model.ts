import { AnimalList } from '../animals/model';

export interface AppState {
  [animalType: string]: AnimalList;
  routes?: any;
  feedback?: any;
}
