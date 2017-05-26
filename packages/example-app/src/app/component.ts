import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'zoo-root',
  templateUrl: './component.html',
  styleUrls: ['./component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'Welcome to the Zoo';
}
