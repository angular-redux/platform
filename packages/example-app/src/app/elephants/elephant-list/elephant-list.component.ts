import { Component } from '@angular/core';
import { select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'zoo-elephant-list',
  templateUrl: './elephant-list.component.html',
  styleUrls: ['./elephant-list.component.css']
})
export class ElephantListComponent {
  // Shorthand for
  // constructor(ngRedux: NgRedux {
  //  this.elephants$ = ngRedux.select(['elephants', 'items']);
  // })
  @select(['elephants', 'items']) readonly elephants$: Observable<any[]>;
  @select(['elephants', 'loading']) readonly loading$: Observable<boolean>;
  @select(['elephants', 'error']) readonly error$: Observable<any>;

  // Since we're observing an array of items, we need to set up a 'trackBy'
  // parameter so Angular doesn't tear down and rebuild the list's DOM every
  // time there's an update.
  getItemName(index, item) {
    return item.name;
  }
}
