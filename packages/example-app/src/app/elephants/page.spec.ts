import {
  MockNgRedux,
  NgReduxTestingModule,
} from '@angular-redux/store/testing';
import { TestBed } from '@angular/core/testing';

import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { toArray } from 'rxjs/operators';

import { AnimalAPIActions } from '../animals/api/actions';
import { Animal, ANIMAL_TYPES } from '../animals/model';
import { ElephantPageComponent } from './page';

@Component({
  selector: 'zoo-animal-list',
  template: 'Mock Animal List',
})
class MockAnimalListComponent {
  @Input() animalsName!: string;
  @Input() animals!: Observable<Animal[]>;
  @Input() loading!: Observable<boolean>;
  @Input() error!: Observable<boolean>;
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

  it('should select some elephants from the Redux store', done => {
    const fixture = TestBed.createComponent(ElephantPageComponent);
    const elephantPage = fixture.componentInstance;
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

    elephantPage.animals
      .pipe(toArray())
      .subscribe(
        actualSequence =>
          expect(actualSequence).toEqual(expectedSequence as any),
        undefined,
        done,
      );
  });

  it('should know when the animals are loading', done => {
    const fixture = TestBed.createComponent(ElephantPageComponent);
    const elephantPage = fixture.componentInstance;

    const stub = MockNgRedux.getSelectorStub(['elephant', 'loading']);
    stub.next(false);
    stub.next(true);
    stub.complete();

    elephantPage.loading
      .pipe(toArray())
      .subscribe(
        actualSequence => expect(actualSequence).toEqual([false, true]),
        undefined,
        done,
      );
  });

  it("should know when there's an error", done => {
    const fixture = TestBed.createComponent(ElephantPageComponent);
    const elephantPage = fixture.componentInstance;

    const stub = MockNgRedux.getSelectorStub(['elephant', 'error']);
    stub.next(false);
    stub.next(true);
    stub.complete();

    elephantPage.error
      .pipe(toArray())
      .subscribe(
        actualSequence => expect(actualSequence).toEqual([false, true]),
        undefined,
        done,
      );
  });

  it('should load elephants on creation', () => {
    const spy = spyOn(MockNgRedux.getInstance(), 'dispatch');
    TestBed.createComponent(ElephantPageComponent);

    expect(spy).toHaveBeenCalledWith({
      type: AnimalAPIActions.LOAD_ANIMALS,
      meta: { animalType: ANIMAL_TYPES.ELEPHANT },
    });
  });
});
