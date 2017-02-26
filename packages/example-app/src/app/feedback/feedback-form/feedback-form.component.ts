import { Component } from '@angular/core';
import { Connect, FormStore } from '@angular-redux/form';
import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'zoo-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: [ './feedback-form.component.css' ],
})
export class FeedbackFormComponent {
  readonly MAX_COMMENT_CHARS = 300;
  readonly charsLeft$: Observable<number>;

  constructor(store: NgRedux<any>) {
    this.charsLeft$ = store.select<string>(['feedback', 'comments'])
      .map(comments => comments || '')
      .map(comments => this.MAX_COMMENT_CHARS - comments.length);
  }
}