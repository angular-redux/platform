import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IAnimal } from '../model';

@Component({
  selector: 'zoo-animal-list',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimalListComponent {
  @Input() animalsName: string;
  @Input() animalType: string;
  @Input() animals: Observable<IAnimal[]>;
  @Input() loading: Observable<boolean>;
  @Input() error: Observable<any>;

  // Since we're observing an array of items, we need to set up a 'trackBy'
  // parameter so Angular doesn't tear down and rebuild the list's DOM every
  // time there's an update.
  getKey(_, animal: IAnimal) {
    return animal.id;
  }
}
