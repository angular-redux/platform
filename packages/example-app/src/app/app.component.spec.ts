import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgRedux, DevToolsExtension } from '@angular-redux/store';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [ RouterTestingModule ],
    }).compileComponents();
  }));

  it(`should have as title 'Welcome to the Zoo'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Welcome to the Zoo');
  }));
});
