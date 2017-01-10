import { ElephantListComponent } from './elephants/elephant-list/elephant-list.component';
import { LionListComponent } from './lions/lion-list/lion-list.component';

export const appRoutes = [
  { path: 'elephants', component: ElephantListComponent },
  { path: 'lions', component: LionListComponent }
];
