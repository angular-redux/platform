import { ElephantPageComponent } from './elephants/page';
import { FeedbackFormComponent } from './feedback/page';
import { LionPageComponent } from './lions/page';

export const appRoutes = [
  { path: '', redirectTo: '/elephants', pathMatch: 'full' },
  { path: 'elephants', component: ElephantPageComponent },
  { path: 'lions', component: LionPageComponent },
  { path: 'feedback', component: FeedbackFormComponent },
];
