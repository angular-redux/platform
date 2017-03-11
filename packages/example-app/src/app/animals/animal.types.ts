export const ANIMAL_TYPES = {
  LION: 'lion',
  ELEPHANT: 'elephant',
};

// TODO: is there a way to improve this?
export type AnimalType = string;

export interface IAnimal {
  animalType: AnimalType;
  name: string;
}

export interface IAnimalList {
  items: IAnimal[];
  loading: boolean;
  error: any;
}
