import {
  MockNgRedux,
  NgReduxTestingModule,
} from '@angular-redux/store/testing';
import { TestBed } from '@angular/core/testing';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toArray';

import { FeedbackFormComponent } from './page';

xdescribe('Feedback Form Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackFormComponent],
      imports: [NgReduxTestingModule],
    }).compileComponents();

    MockNgRedux.reset();
  });

  it('should keep track of the number of remaining characters left', done => {
    const fixture = TestBed.createComponent(FeedbackFormComponent);
    const form = fixture.debugElement.componentInstance;

    const expectedCharsLeftSequence = [
      form.getMaxCommentChars() - 1,
      form.getMaxCommentChars() - 2,
      form.getMaxCommentChars() - 3,
      form.getMaxCommentChars() - 4,
      form.getMaxCommentChars() - 5,
    ];

    const feedbackCommentsStub = MockNgRedux.getSelectorStub([
      'feedback',
      'comments',
    ]);
    feedbackCommentsStub.next('h');
    feedbackCommentsStub.next('he');
    feedbackCommentsStub.next('hel');
    feedbackCommentsStub.next('hell');
    feedbackCommentsStub.next('hello');
    feedbackCommentsStub.complete();

    form.charsLeft$
      .toArray()
      .subscribe(
        actualSequence =>
          expect(actualSequence).toEqual(expectedCharsLeftSequence),
        null,
        done,
      );
  });
});
