import { dispatch, select, select$, WithSubStore } from '@angular-redux/store';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Animal } from '../model';
import { animalComponentReducer } from './reducers';

export function toSubTotal(obs: Observable<Animal>): Observable<number> {
  return obs.pipe(map(s => s.ticketPrice * s.tickets));
}

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

  @select() readonly name!: Observable<string>;
  @select('tickets') readonly numTickets!: Observable<number>;
  @select('ticketPrice') readonly ticketPrice!: Observable<number>;
  @select$('', toSubTotal)
  readonly subTotal!: Observable<number>;

  getBasePath = () => (this.key ? [this.animalType, 'items', this.key] : null);

  @dispatch() addTicket = () => ({ type: 'ADD_TICKET' });
  @dispatch() removeTicket = () => ({ type: 'REMOVE_TICKET' });
}
