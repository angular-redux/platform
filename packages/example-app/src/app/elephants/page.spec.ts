import { TestBed, async } from '@angular/core/testing';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';

import { Component, Input } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/do';

import { ElephantPageComponent } from './page';
import { AnimalAPIActions } from '../animals/api/actions';
import { ANIMAL_TYPES } from '../animals/model';

@Component({
  selector: 'zoo-animal-list',
  template: 'Mock Animal List',
})
class MockAnimalListComponent {
  @Input() animalsName: string;
  @Input() animals: Observable<any>;
  @Input() loading: Observable<boolean>;
  @Input() error: Observable<any>;
};

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
    const elephantPage = fixture.debugElement.componentInstance;
    const mockStoreSequence = [
      { elephant1: { name: 'I am an Elephant!', id: 'elephant1' } },
      {
        elephant1: { name: 'I am an Elephant!', id: 'elephant1' },
        elephant2: { name: 'I am a second Elephant!', id: 'elephant2' },
      }];

    const expectedSequence = [
      [ { name: 'I am an Elephant!', id: 'elephant1' } ],
      [
        // Alphanumeric sort by name.
        { name: 'I am a second Elephant!', id: 'elephant2' },
        { name: 'I am an Elephant!', id: 'elephant1' },
      ]
    ];

    const elephantItemStub = MockNgRedux.getSelectorStub(['elephant', 'items']);
    mockStoreSequence.forEach(value => elephantItemStub.next(value));
    elephantItemStub.complete();

    elephantPage.animals$
      .toArray()
      .subscribe(
        actualSequence => expect(actualSequence).toEqual(expectedSequence),
        null,
        done);
  });

  it('should know when the animals are loading', done => {
    const fixture = TestBed.createComponent(ElephantPageComponent);
    const elephantPage = fixture.debugElement.componentInstance;

    const stub = MockNgRedux.getSelectorStub(['elephant', 'loading']);
    stub.next(false);
    stub.next(true);
    stub.complete();

    elephantPage.loading$
      .toArray()
      .subscribe(
        actualSequence => expect(actualSequence).toEqual([ false, true ]),
        null,
        done);
  });

  it('should know when there\'s an error', done => {
    const fixture = TestBed.createComponent(ElephantPageComponent);
    const elephantPage = fixture.debugElement.componentInstance;

    const stub = MockNgRedux.getSelectorStub(['elephant', 'error']);
    stub.next(false);
    stub.next(true);
    stub.complete();

    elephantPage.error$
      .toArray()
      .subscribe(
        actualSequence => expect(actualSequence).toEqual([ false, true ]),
        null,
        done);
  });

  it('should load elephants on creation', () => {
    const spy = spyOn(MockNgRedux.mockInstance, 'dispatch');
    const fixture = TestBed.createComponent(ElephantPageComponent);

    expect(spy).toHaveBeenCalledWith({
      type: AnimalAPIActions.LOAD_ANIMALS,
      meta: { animalType: ANIMAL_TYPES.ELEPHANT },
      payload: null,
    });
  });
});
