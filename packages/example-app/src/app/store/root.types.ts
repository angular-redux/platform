import { IAnimalList } from '../animals/animal.types';

export interface IAppState {
  elephants?: IAnimalList;
  lions?: IAnimalList;
  routes?: any;
  feedback?: any;
}
