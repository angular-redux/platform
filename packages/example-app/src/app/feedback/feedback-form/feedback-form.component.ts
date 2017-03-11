import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Connect } from '@angular-redux/form';
import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { IAppState } from '../../store/root.types';

@Component({
  selector: 'zoo-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: [ './feedback-form.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackFormComponent {
  readonly MAX_COMMENT_CHARS = 300;
  readonly charsLeft$: Observable<number>;

  constructor(store: NgRedux<IAppState>) {
    this.charsLeft$ = store.select<string>(['feedback', 'comments'])
      .map(comments => comments || '')
      .map(comments => this.MAX_COMMENT_CHARS - comments.length);
  }
}
