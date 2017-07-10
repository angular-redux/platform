import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { dispatch, select, select$, WithSubStore } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

import { animalComponentReducer } from './reducers';
import { IAnimal } from '../model';

export const toSubTotal = (obs$: Observable<IAnimal>): Observable<number> =>
  obs$.map(s => s.ticketPrice * s.tickets);

/**
 * Fractal component example.
 */
@WithSubStore({
  basePathMethodName: 'getBasePath',
  localReducer: animalComponentReducer,
})
@Component({
  selector: 'zoo-animal',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimalComponent {
  static readonly ADD_TICKET = 'ADD_TICKET';
  static readonly REMOVE_TICKET = 'REMOVE_TICKET';

  @Input() key: string;
  @Input() animalType: string;

  @select()                  readonly name$: Observable<string>;
  @select('tickets')         readonly numTickets$: Observable<number>;
  @select('ticketPrice')     readonly ticketPrice$: Observable<number>;
  @select$(null, toSubTotal) readonly subTotal$: Observable<number>;

  getBasePath = () => this.key ?
    [ this.animalType, 'items', this.key ] :
    null;

  @dispatch() addTicket = () => ({ type: 'ADD_TICKET' });
  @dispatch() removeTicket = () => ({ type: 'REMOVE_TICKET' });
}
