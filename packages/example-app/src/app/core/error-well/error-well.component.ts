import { Input, Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'zoo-error-well',
  templateUrl: './error-well.component.html',
  styleUrls: [ './error-well.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorWellComponent {
  @Input() statusCode$: Observable<number>;
}
