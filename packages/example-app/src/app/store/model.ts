import { IAnimalList } from '../animals/model';

export interface IAppState {
  [animalType: string]: IAnimalList;
  routes?: any;
  feedback?: any;
}
