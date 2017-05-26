import { IAnimalList } from '../animals/model';

export interface IAppState {
  elephants?: IAnimalList;
  lions?: IAnimalList;
  routes?: any;
  feedback?: any;
}
