import { async, TestBed } from '@angular/core/testing';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';
import { AnimalComponent } from './component';
import { CoreModule } from '../../core/module';
import 'rxjs/add/operator/toArray';

describe('AnimalComponent', () => {
  let fixture;
  let animalComponent;
  let spyConfigureSubStore;

  beforeEach(async(() => {
    spyConfigureSubStore = spyOn(MockNgRedux.mockInstance, 'configureSubStore')
      .and.callThrough();

    MockNgRedux.reset();
    TestBed.configureTestingModule({
      declarations: [AnimalComponent],
      imports: [CoreModule, NgReduxTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalComponent);
    animalComponent = fixture.debugElement.componentInstance;

    animalComponent.key = 'id1';
    animalComponent.animalType = 'WALLABIES';

    fixture.detectChanges();
  }));

  it('should use the key to create a subStore', () =>
    expect(spyConfigureSubStore).toHaveBeenCalledWith(
      ['WALLABIES', 'items', 'id1'],
      jasmine.any(Function)));

  it('select name data from the substore', async(() => {
    const mockSubStore = MockNgRedux.getSubStore(
      ['WALLABIES', 'items', 'id1']);

    const selectorStub = mockSubStore.getSelectorStub('name');
    selectorStub.next('Wilbert');
    selectorStub.complete();

    animalComponent.name$
      .subscribe(
        name => expect(name).toEqual('Wilbert'));
  }));

  it('select ticket price data from the substore', async(() => {
    const mockSubStore = MockNgRedux.getSubStore(
      ['WALLABIES', 'items', 'id1']);

    const selectorStub = mockSubStore.getSelectorStub('ticketPrice');
    selectorStub.next(2);
    selectorStub.complete();

    animalComponent.ticketPrice$
      .subscribe(
        ticketPrice => expect(ticketPrice).toEqual(2));
  }));

  it('select ticket quantity data from the substore', async(() => {
    const mockSubStore = MockNgRedux.getSubStore(
      ['WALLABIES', 'items', 'id1']);

    const selectorStub = mockSubStore.getSelectorStub('tickets');
    selectorStub.next(4);
    selectorStub.complete();

    animalComponent.numTickets$
      .subscribe(
        numTickets => expect(numTickets).toEqual(4));
  }));

  it('should use reasonable defaults if ticket price is missing', async(() => {
    animalComponent.ticketPrice$
      .subscribe(
        ticketPrice => expect(ticketPrice).toEqual(0));
  }));

  it('should use reasonable defaults if ticket quantity is missing', async(() => {
    animalComponent.numTickets$
      .subscribe(
        numTickets => expect(numTickets).toEqual(0));
  }));

  it('should compute the subtotal as the ticket quantity changes', async(() => {
    const mockSubStore = MockNgRedux.getSubStore(
      ['WALLABIES', 'items', 'id1']);

    const priceStub = mockSubStore.getSelectorStub('ticketPrice');
    priceStub.next(1);
    priceStub.next(2);
    priceStub.next(3);
    priceStub.complete();

    const quantityStub = mockSubStore.getSelectorStub('tickets');
    quantityStub.next(5);
    quantityStub.complete();

    animalComponent.subTotal$
      .toArray()
      .subscribe(
        subTotals => expect(subTotals).toEqual([5, 10, 15]));
  }));
});
