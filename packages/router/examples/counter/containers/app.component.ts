import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'root',
    template: `
    <a [routerLink]="['/first']">First</a>
    <a [routerLink]="['/second']">Second</a>
    <a [routerLink]="['/third']">Third</a>
    <counter></counter>
    <counter-info></counter-info>

    <router-outlet></router-outlet>
  `
})
export class AppComponent {
}

@Component({
    selector: 'first',
    template: `
    first
  `
})
export class FirstComponent {
}

@Component({
    selector: 'second',
    template: `
    second
  `
})
export class SecondComponent {
}

@Component({
    selector: 'third',
    template: `
    third
  `
})
export class ThirdComponent {
}
