import {
  MockNgRedux,
  NgReduxTestingModule,
} from '@angular-redux/store/testing';
import { TestBed } from '@angular/core/testing';

import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { toArray } from 'rxjs/operators';
import { AnimalAPIActions } from '../animals/api/actions';
import { ANIMAL_TYPES } from '../animals/model';
import { ElephantPageComponent } from './page';

@Component({
  selector: 'zoo-animal-list',
  template: 'Mock Animal List',
})
class MockAnimalListComponent {
  @Input() animalsName: string;
  @Input() animals: Observable<any>;
  @Input() loading: Observable<boolean>;
  @Input() error: Observable<any>;
}

describe('Elephant Page Container', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElephantPageComponent, MockAnimalListComponent],
      imports: [NgReduxTestingModule],
      providers: [AnimalAPIActions],
    }).compileComponents();

    MockNgRedux.reset();
  });

  it('should select some elephants from the Redux store', async () => {
    const fixture = TestBed.createComponent(ElephantPageComponent);
    const elephantPage: ElephantPageComponent = fixture.componentInstance;
    const mockStoreSequence = [
      { elephant1: { name: 'I am an Elephant!', id: 'elephant1' } },
      {
        elephant1: { name: 'I am an Elephant!', id: 'elephant1' },
        elephant2: { name: 'I am a second Elephant!', id: 'elephant2' },
      },
    ];

    const expectedSequence = [
      [{ name: 'I am an Elephant!', id: 'elephant1' }],
      [
        // Alphanumeric sort by name.
        { name: 'I am a second Elephant!', id: 'elephant2' },
        { name: 'I am an Elephant!', id: 'elephant1' },
      ],
    ];

    const elephantItemStub = MockNgRedux.getSelectorStub(['elephant', 'items']);
    mockStoreSequence.forEach(value => elephantItemStub.next(value));
    elephantItemStub.complete();

    const actualSequence = await new Promise(resolve =>
      elephantPage.animals$.pipe(toArray()).subscribe(resolve),
    );
    expect(actualSequence).toEqual(expectedSequence);
  });

  it('should know when the animals are loading', async () => {
    const fixture = TestBed.createComponent(ElephantPageComponent);
    const elephantPage: ElephantPageComponent = fixture.componentInstance;

    const stub = MockNgRedux.getSelectorStub(['elephant', 'loading']);
    stub.next(false);
    stub.next(true);
    stub.complete();

    const actualSequence = await new Promise(resolve =>
      elephantPage.loading$.pipe(toArray()).subscribe(resolve),
    );
    expect(actualSequence).toEqual([false, true]);
  });

  it("should know when there's an error", async () => {
    const fixture = TestBed.createComponent(ElephantPageComponent);
    const elephantPage: ElephantPageComponent = fixture.componentInstance;

    const stub = MockNgRedux.getSelectorStub(['elephant', 'error']);
    stub.next(false);
    stub.next(true);
    stub.complete();

    const actualSequence = await new Promise(resolve =>
      elephantPage.error$.pipe(toArray()).subscribe(resolve),
    );
    expect(actualSequence).toEqual([false, true]);
  });

  it('should load elephants on creation', () => {
    const spy = spyOn(MockNgRedux.mockInstance!, 'dispatch');
    TestBed.createComponent(ElephantPageComponent);

    expect(spy).toHaveBeenCalledWith({
      type: AnimalAPIActions.LOAD_ANIMALS,
      meta: { animalType: ANIMAL_TYPES.ELEPHANT },
      payload: undefined,
    });
  });
});
