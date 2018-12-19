import {
  MockNgRedux,
  NgReduxTestingModule,
} from '@angular-redux/store/testing';
import { TestBed } from '@angular/core/testing';

import { toArray } from 'rxjs/operators';
import { FeedbackFormComponent } from './page';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

describe('Feedback Form Component', () => {
  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(),
    );

    TestBed.configureTestingModule({
      declarations: [FeedbackFormComponent],
      imports: [NgReduxTestingModule],
    }).compileComponents();

    MockNgRedux.reset();
  });

  it('should keep track of the number of remaining characters left', async () => {
    const fixture = TestBed.createComponent(FeedbackFormComponent);
    const form = fixture.componentInstance;

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

    const actualSequence = await new Promise(resolve =>
      form.charsLeft$.pipe(toArray()).subscribe(resolve),
    );

    expect(actualSequence).toEqual(expectedCharsLeftSequence);
  });
});
