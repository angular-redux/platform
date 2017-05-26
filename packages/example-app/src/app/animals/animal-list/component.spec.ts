import { Component, Input } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { AnimalListComponent } from './component';
import { CoreModule } from '../../core/module';
import { AnimalType } from '../model';

@Component({ selector: 'zoo-animal', template: '' })
class MockAnimalComponent {
  @Input() key: string
  @Input() animalType: AnimalType
}

describe('AnimalListComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnimalListComponent, MockAnimalComponent],
      imports: [CoreModule],
    }).compileComponents();
  }));

  it(`should have as title 'Welcome to the Zoo'`, async(() => {
    const fixture = TestBed.createComponent(AnimalListComponent);
    const animalList = fixture.debugElement.componentInstance;

    animalList.animalsName = 'Wallabies';
    animalList.animalType = 'WALLABIES';
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('h2'));
    expect(titleElement.nativeElement.textContent).toContain('We have Wallabies');
  }));
});
