import { Component } from '@angular/core';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'zoo-lion-list',
  templateUrl: './lion-list.component.html',
  styleUrls: ['./lion-list.component.css']
})
export class LionListComponent {
  // Shorthand for
  // constructor(ngRedux: NgRedux {
  //  this.elephants$ = ngRedux.select(['lions', 'items']);
  // })
  @select(['lions', 'items']) readonly lions$: Observable<any[]>;
  @select(['lions', 'loading']) readonly loading$: Observable<boolean>;
  @select(['lions', 'error']) readonly error$: Observable<any>;

  // Since we're observing an array of items, we need to set up a 'trackBy'
  // parameter so Angular doesn't tear down and rebuild the list's DOM every
  // time there's an update.
  getItemName(index, item) {
    return item.name;
  }
}
