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
import { LionPageComponent } from './page';

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

describe('Lion Page Container', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LionPageComponent, MockAnimalListComponent],
      imports: [NgReduxTestingModule],
      providers: [AnimalAPIActions],
    }).compileComponents();

    MockNgRedux.reset();
  });

  // TO DO: debug later
  xit('should select some lions from the Redux store', done => {
    const fixture = TestBed.createComponent(LionPageComponent);
    const lionPage = fixture.componentInstance;
    const mockStoreSequence = [
      { lion1: { name: 'I am a Lion!', id: 'lion1' } },
      {
        lion1: { name: 'I am a Lion!', id: 'lion1' },
        lion2: { name: 'I am a second Lion!', id: 'lion2' },
      },
    ];

    const expectedSequence = [
      [{ name: 'I am a Lion!', id: 'lion1' }],
      [
        // Alphanumeric sort by name.
        { name: 'I am a Lion!', id: 'lion1' },
        { name: 'I am a second Lion!', id: 'lion2' },
      ],
    ];

    const itemStub = MockNgRedux.getSelectorStub(['lion', 'items']);
    mockStoreSequence.forEach(value => itemStub.next(value));
    itemStub.complete();

    lionPage.animals
      .pipe(toArray())
      .subscribe(
        actualSequence =>
          expect(actualSequence).toEqual(expectedSequence as any),
        undefined,
        done,
      );
  });

  it('should know when the animals are loading', done => {
    const fixture = TestBed.createComponent(LionPageComponent);
    const lionPage = fixture.componentInstance;

    const lionsLoadingStub = MockNgRedux.getSelectorStub(['lion', 'loading']);
    lionsLoadingStub.next(false);
    lionsLoadingStub.next(true);
    lionsLoadingStub.complete();

    lionPage.loading
      .pipe(toArray())
      .subscribe(
        actualSequence => expect(actualSequence).toEqual([false, true]),
        undefined,
        done,
      );
  });

  it("should know when there's an error", done => {
    const fixture = TestBed.createComponent(LionPageComponent);
    const lionPage = fixture.componentInstance;

    const lionsErrorStub = MockNgRedux.getSelectorStub(['lion', 'error']);
    lionsErrorStub.next(false);
    lionsErrorStub.next(true);
    lionsErrorStub.complete();

    lionPage.error
      .pipe(toArray())
      .subscribe(
        actualSequence => expect(actualSequence).toEqual([false, true]),
        undefined,
        done,
      );
  });

  it('should load lions on creation', () => {
    const spy = spyOn(MockNgRedux.getInstance(), 'dispatch');
    TestBed.createComponent(LionPageComponent);

    expect(spy).toHaveBeenCalledWith({
      type: AnimalAPIActions.LOAD_ANIMALS,
      meta: { animalType: ANIMAL_TYPES.LION },
    });
  });
});
