import { Component } from '@angular/core';
import { select } from 'ng2-redux';

@Component({
  selector: 'app-lion-list',
  templateUrl: './lion-list.component.html',
  styleUrls: ['./lion-list.component.css']
})
export class LionListComponent {
  // Shorthand for
  // constructor(ngRedux: NgRedux { this.lions$ = ngRedux.select('lions'); })
  @select() lions$

  // Since we're observing an array of items, we need to set up a 'trackBy'
  // parameter so Angular doesn't tear down and rebuild the list's DOM every
  // time there's an update.
  getItemName(index, item) {
    return item.name;
  }
}
