import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgRedux, DevToolsExtension } from '@angular-redux/store';
import { AppComponent } from './app.component';
import { AppActions } from './app.actions';

// I follow a minimal mocking approach:
// Mock all dependencies with empty objects
// and let each test specify the exact stub
// or spy behaviour that it needs. This keeps
// mocks simple and tests decoupled as they
// should be.
const mockRedux = {
  dispatch: function() {},
};
const mockDevTools = {};

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: NgRedux, useValue: mockRedux },
        { provide: DevToolsExtension, useValue: mockDevTools },
        AppActions,
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Welcome to the Zoo'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Welcome to the Zoo');
  }));
});
