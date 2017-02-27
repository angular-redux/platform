import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import { AppActions } from './app.actions';

@Component({
  selector: 'zoo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Welcome to the Zoo';

  constructor(ngRedux: NgRedux<any>, actions: AppActions) {
    ngRedux.dispatch(actions.loadData());
  }
}
