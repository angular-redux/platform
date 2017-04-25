import { TestBed, async } from '@angular/core/testing';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';
import { NgRedux } from '@angular-redux/store';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/do';

import { FeedbackFormComponent } from './feedback-form.component';

describe('Feedback Form Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackFormComponent],
      imports: [NgReduxTestingModule],
    }).compileComponents();

    MockNgRedux.reset();
  });

  it('should keep track of the number of remaining characters left', (done) => {
    const fixture = TestBed.createComponent(FeedbackFormComponent);
    const form = fixture.debugElement.componentInstance;

    const expectedCharsLeftSequence = [
      form.MAX_COMMENT_CHARS - 1,
      form.MAX_COMMENT_CHARS - 2,
      form.MAX_COMMENT_CHARS - 3,
      form.MAX_COMMENT_CHARS - 4,
      form.MAX_COMMENT_CHARS - 5,
    ];

    const feedbackCommentsStub = MockNgRedux.getSelectorStub(['feedback', 'comments']);
    feedbackCommentsStub.next('h');
    feedbackCommentsStub.next('he');
    feedbackCommentsStub.next('hel');
    feedbackCommentsStub.next('hell');
    feedbackCommentsStub.next('hello');
    feedbackCommentsStub.complete();

    form.charsLeft$
      .toArray()
      .subscribe(
        actualSequence => expect(actualSequence).toEqual(expectedCharsLeftSequence),
        null,
        done);
  });
});
