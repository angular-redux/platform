import { TestBed, async } from '@angular/core/testing';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';

import { Component, Input } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/do';

import { ElephantPageComponent } from './elephant-page.container';
import { AnimalActions } from '../animals/animal.actions';
import { ANIMAL_TYPES } from '../animals/animal.types';

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
      providers: [AnimalActions],
    }).compileComponents();

    MockNgRedux.reset();
  });

  it('should select some elephants from the Redux store', done => {
    const fixture = TestBed.createComponent(ElephantPageComponent);
    const elephantPage = fixture.debugElement.componentInstance;
    const expectedSequence = [
      [ { name: 'I am an Elephant!' } ],
      [ { name: 'I am an Elephant!' }, { name: 'I am a second Elephant!' } ]
    ];

    const elephantItemStub = MockNgRedux.getSelectorStub(['elephants', 'items']);
    expectedSequence.forEach(value => elephantItemStub.next(value));
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

    const stub = MockNgRedux.getSelectorStub(['elephants', 'loading']);
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

    const stub = MockNgRedux.getSelectorStub(['elephants', 'error']);
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
      type: AnimalActions.LOAD_STARTED,
      meta: { animalType: ANIMAL_TYPES.ELEPHANT },
    });
  });
});
