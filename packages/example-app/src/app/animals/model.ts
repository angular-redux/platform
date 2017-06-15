export const ANIMAL_TYPES = {
  LION: 'lion',
  ELEPHANT: 'elephant',
};

// TODO: is there a way to improve this?
export type AnimalType = string;

export interface IAnimal {
  id: string;
  animalType: AnimalType;
  name: string;
  ticketPrice: number;
  tickets: number;
}

export interface IAnimalList {
  items: {};
  loading: boolean;
  error: any;
}

export const fromServer = (record: any): IAnimal => ({
  id: record.name.toLowerCase(),
  animalType: record.animalType,
  name: record.name,
  ticketPrice: record.ticketPrice || 0,
  tickets: record.tickets || 0,
});
