import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Animal } from '../model';

@Component({
  selector: 'zoo-animal-list',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimalListComponent {
  @Input() animalsName: string;
  @Input() animalType: string;
  @Input() animals: Observable<Animal[]>;
  @Input() loading: Observable<boolean>;
  @Input() error: Observable<any>;

  // Since we're observing an array of items, we need to set up a 'trackBy'
  // parameter so Angular doesn't tear down and rebuild the list's DOM every
  // time there's an update.
  getKey(_: any, animal: Animal) {
    return animal.id;
  }
}
