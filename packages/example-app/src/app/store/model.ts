import { AnimalList, AnimalType, initialAnimalList } from '../animals/model';

export type AppState = { [key in AnimalType]: AnimalList } &
  Partial<{
    routes: any;
    feedback: any;
  }>;

export function initialAppState() {
  return {
    lion: initialAnimalList(),
    elephant: initialAnimalList(),
  };
}
