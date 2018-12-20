import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './component';
import {
  platformBrowserDynamicTesting,
  BrowserDynamicTestingModule,
} from '@angular/platform-browser-dynamic/testing';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  }));

  it("should have as title 'Welcome to the Zoo'", async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Welcome to the Zoo');
  }));
});
