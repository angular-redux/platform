import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { AnimalListComponent } from './animal-list.component';
import { CoreModule } from '../../core/core.module';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnimalListComponent],
      imports: [CoreModule],
    }).compileComponents();
  }));

  it(`should have as title 'Welcome to the Zoo'`, async(() => {
    const fixture = TestBed.createComponent(AnimalListComponent);
    const app = fixture.debugElement.componentInstance;

    app.animalsName = 'Wallabies';
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('h2'));
    expect(titleElement.nativeElement.textContent).toContain('We have Wallabies');
  }));
});
