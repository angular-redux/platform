import { AnimalList, AnimalType, initialAnimalList } from '../animals/model';

export type AppState = { [key in AnimalType]: AnimalList } &
  Partial<{
    routes: string;
    feedback: unknown;
  }>;

export function initialAppState() {
  return {
    lion: initialAnimalList(),
    elephant: initialAnimalList(),
  };
}
