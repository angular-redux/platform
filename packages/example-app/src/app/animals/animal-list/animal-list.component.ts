import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'zoo-animal-list',
  templateUrl: './animal-list.component.html',
  styleUrls: ['./animal-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimalListComponent {
  @Input() animalsName: string;
  @Input() animals: Observable<any[]>;
  @Input() loading: Observable<boolean>;
  @Input() error: Observable<any>;

  // Since we're observing an array of items, we need to set up a 'trackBy'
  // parameter so Angular doesn't tear down and rebuild the list's DOM every
  // time there's an update.
  getAnimalName(_, animal) {
    return animal.name;
  }
}
