import {
  MockNgRedux,
  MockObservableStore,
  NgReduxTestingModule,
} from '@angular-redux/store/testing';
import { async, TestBed } from '@angular/core/testing';
import { AnyAction, Reducer } from 'redux';
import { CoreModule } from '../../core/module';
import { AnimalComponent } from './component';

type ConfigureSubStoreFn = (
  basePath: (string | number)[],
  _: Reducer<any, AnyAction>,
) => MockObservableStore<any>;

describe('AnimalComponent', () => {
  let fixture;
  let animalComponent: AnimalComponent;
  let spyConfigureSubStore: ConfigureSubStoreFn;

  beforeEach(async(() => {
    spyConfigureSubStore = spyOn(
      MockNgRedux.mockInstance!,
      'configureSubStore',
    ).and.callThrough();

    MockNgRedux.reset();
    TestBed.configureTestingModule({
      declarations: [AnimalComponent],
      imports: [CoreModule, NgReduxTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalComponent);
    animalComponent = fixture.componentInstance;

    animalComponent.key = 'id1';
    animalComponent.animalType = 'WALLABIES';

    fixture.detectChanges();
  }));

  it('should use the key to create a subStore', () =>
    expect(spyConfigureSubStore).toHaveBeenCalledWith(
      ['WALLABIES', 'items', 'id1'],
      expect.any(Function),
    ));

  it('select name data from the substore', async () => {
    const mockSubStore = MockNgRedux.getSubStore(['WALLABIES', 'items', 'id1']);

    const selectorStub = mockSubStore.getSelectorStub('name');
    selectorStub.next('Wilbert');
    selectorStub.complete();

    const animalName = await new Promise(resolve =>
      animalComponent.name$.subscribe(resolve),
    );

    expect(animalName).toEqual('Wilbert');
  });

  it('select ticket price data from the substore', async () => {
    const mockSubStore = MockNgRedux.getSubStore(['WALLABIES', 'items', 'id1']);

    const selectorStub = mockSubStore.getSelectorStub('ticketPrice');
    selectorStub.next(2);
    selectorStub.complete();

    const ticketPrice = await new Promise(resolve =>
      animalComponent.ticketPrice$.subscribe(resolve),
    );

    expect(ticketPrice).toEqual(2);
  });

  it('select ticket quantity data from the substore', async () => {
    const mockSubStore = MockNgRedux.getSubStore(['WALLABIES', 'items', 'id1']);

    const selectorStub = mockSubStore.getSelectorStub('tickets');
    selectorStub.next(4);
    selectorStub.complete();

    const numTickets = await new Promise(resolve =>
      animalComponent.numTickets$.subscribe(resolve),
    );

    expect(numTickets).toEqual(4);
  });

  xit('should use reasonable defaults if ticket price is missing', async () => {
    const ticketPrice = await new Promise(resolve =>
      animalComponent.ticketPrice$.subscribe(resolve),
    );
    expect(ticketPrice).toEqual(0);
  });

  xit('should use reasonable defaults if ticket quantity is missing', async () => {
    const numTickets = await new Promise(resolve =>
      animalComponent.numTickets$.subscribe(resolve),
    );
    expect(numTickets).toEqual(0);
  });

  xit('should compute the subtotal as the ticket quantity changes', async () => {
    const mockSubStore = MockNgRedux.getSubStore(['WALLABIES', 'items', 'id1']);

    const subTotalsPromise = new Promise(resolve =>
      animalComponent.subTotal$.subscribe(resolve),
    );

    const priceStub = mockSubStore.getSelectorStub('ticketPrice');
    priceStub.next(1);
    priceStub.next(2);
    priceStub.next(3);
    priceStub.complete();

    const quantityStub = mockSubStore.getSelectorStub('tickets');
    quantityStub.next(5);
    quantityStub.complete();

    const subTotals = await subTotalsPromise;
    expect(subTotals).toEqual([5, 10, 15]);
  });
});
