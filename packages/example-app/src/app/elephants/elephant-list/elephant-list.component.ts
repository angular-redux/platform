import { Component } from '@angular/core';
import { select } from 'ng2-redux';

@Component({
  selector: 'app-elephant-list',
  templateUrl: './elephant-list.component.html',
  styleUrls: ['./elephant-list.component.css']
})
export class ElephantListComponent {
  // Shorthand for
  // constructor(ngRedux: NgRedux { this.elephants$ = ngRedux.select('elephants'); })
  @select() elephants$

  // Since we're observing an array of items, we need to set up a 'trackBy'
  // parameter so Angular doesn't tear down and rebuild the list's DOM every
  // time there's an update.
  getItemName(index, item) {
    return item.name;
  }
}
