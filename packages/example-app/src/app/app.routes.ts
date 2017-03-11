import { ElephantPageComponent } from './elephants/elephant-page.container';
import { LionPageComponent } from './lions/lion-page.container';
import { FeedbackFormComponent } from './feedback/feedback-form/feedback-form.component';

export const appRoutes = [
  { path: '', redirectTo: '/elephants', pathMatch: 'full' },
  { path: 'elephants', component: ElephantPageComponent },
  { path: 'lions', component: LionPageComponent },
  { path: 'feedback', component: FeedbackFormComponent },
];
