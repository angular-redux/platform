import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { NgRedux, dispatch, select, ObservableStore } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IAppState } from '../../store/model';
import { animalComponentReducer } from './reducers';

/**
 * Fractal component example.
 */
@Component({
  selector: 'zoo-animal',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimalComponent implements OnInit {
  static readonly ADD_TICKET = 'ADD_TICKET';
  static readonly REMOVE_TICKET = 'REMOVE_TICKET';

  @Input() key: string;
  @Input() animalType: string;

  private subStore: ObservableStore<any>;

  name$: Observable<string>;
  numTickets$: Observable<number>;
  ticketPrice$: Observable<number>;
  subTotal$: Observable<number>;

  constructor(private ngRedux: NgRedux<IAppState>) {}

  addTicket = () => this.subStore.dispatch({ type: 'ADD_TICKET' });
  removeTicket = () => this.subStore.dispatch({ type: 'REMOVE_TICKET' });

  // Can't be done in the constructor because it relies on data from the
  // inputs.
  ngOnInit() {
    this.subStore = this.ngRedux.configureSubStore<any>(
      [this.animalType, 'items', this.key],
      animalComponentReducer);
    this.name$ = this.subStore.select('name');
    this.numTickets$ = this.subStore.select(['tickets'])
      .map(n => n || 0);
    this.ticketPrice$ = this.subStore.select('ticketPrice')
      .map(n => n || 1);

    this.subTotal$ = Observable.combineLatest(
      this.numTickets$,
      this.ticketPrice$,
      (num, price) => num * price);
  }
}
