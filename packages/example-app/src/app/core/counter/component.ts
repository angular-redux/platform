import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'zoo-counter',
  templateUrl: './component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent {
  @Input() count!: number;
  @Output() increment = new EventEmitter<void>();
  @Output() decrement = new EventEmitter<void>();
}
