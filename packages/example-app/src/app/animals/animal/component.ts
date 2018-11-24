import { select, select$, WithSubStore, dispatch } from '@angular-redux/store';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Animal } from '../model';
import { animalComponentReducer } from './reducers';
import { TicketActions } from './ticket-actions';

export const toSubTotal = (obs$: Observable<Animal>): Observable<number> =>
  obs$.pipe(map(s => s.ticketPrice * s.tickets));

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

  @Input() key!: string;
  @Input() animalType!: string;

  @select() readonly name$!: Observable<string>;
  @select('tickets') readonly numTickets$!: Observable<number>;
  @select('ticketPrice') readonly ticketPrice$!: Observable<number>;
  @select$('', toSubTotal)
  readonly subTotal$!: Observable<number>;

  getBasePath = () => (this.key ? [this.animalType, 'items', this.key] : null);

  @dispatch() addTicket = () => ({ type: TicketActions.ADD_TICKET });
  @dispatch() removeTicket = () => ({ type: TicketActions.REMOVE_TICKET });

  /*
  addTicket() {
    this.actions.addTicket();
  }

  removeTicket() {
    this.actions.removeTicket();
  }
  */

}
