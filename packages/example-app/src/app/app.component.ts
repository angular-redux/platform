import { Component } from '@angular/core';
import { NgRedux } from '@angular-redux/store';

import { AppActions } from './app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Welcome to the Zoo';

  constructor(
    private ngRedux: NgRedux<any>,
    private actions: AppActions,
  ) { }

  ngOnInit() {
    this.ngRedux.dispatch(this.actions.loadData());
  }
}