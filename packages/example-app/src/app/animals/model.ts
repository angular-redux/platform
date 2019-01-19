export const ANIMAL_TYPES: { [key: string]: AnimalType } = {
  LION: 'lion',
  ELEPHANT: 'elephant',
};

// TODO: is there a way to improve this?
export type AnimalType = 'lion' | 'elephant';
export interface Animal {
  id: string;
  animalType: AnimalType;
  name: string;
  ticketPrice: number;
  tickets: number;
}

export interface AnimalResponse {
  name: string;
  type: AnimalType;
  ticketPrice: number;
}

export interface AnimalList {
  items: {};
  loading: boolean;
  error: boolean | undefined;
}

export interface AnimalError {
  status: string;
}

export function initialAnimalList(): AnimalList {
  return {
    items: {},
    loading: false,
    error: undefined,
  };
}

export const fromServer = (record: AnimalResponse): Animal => ({
  id: record.name.toLowerCase(),
  animalType: record.type,
  name: record.name,
  ticketPrice: record.ticketPrice || 0,
  tickets: 0,
});
