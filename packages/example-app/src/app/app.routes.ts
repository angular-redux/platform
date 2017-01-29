import { ElephantListComponent } from './elephants/elephant-list/elephant-list.component';
import { LionListComponent } from './lions/lion-list/lion-list.component';
import { FeedbackFormComponent } from './feedback/feedback-form/feedback-form.component';

export const appRoutes = [
  { path: '',   redirectTo: '/elephants', pathMatch: 'full' },
  { path: 'elephants', component: ElephantListComponent },
  { path: 'lions', component: LionListComponent },
  { path: 'feedback', component: FeedbackFormComponent },
];
