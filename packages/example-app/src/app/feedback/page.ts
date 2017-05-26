import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Connect } from '@angular-redux/form';
import { NgRedux, select$ } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { IAppState } from '../store/model';

const MAX_COMMENT_CHARS = 300;

export const charsLeft = (obs$: Observable<string>): Observable<number> =>
  obs$.map(comments => comments || '')
    .map(comments => MAX_COMMENT_CHARS - comments.length);

@Component({
  selector: 'zoo-feedback-form',
  templateUrl: './page.html',
  styleUrls: [ './page.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackFormComponent {
  @select$(['feedback', 'comments'], charsLeft) readonly charsLeft$: Observable<number>;

  getMaxCommentChars = () => MAX_COMMENT_CHARS;
}
