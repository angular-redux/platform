import { ElephantPageComponent } from './elephants/page';
import { LionPageComponent } from './lions/page';
import { FeedbackFormComponent } from './feedback/page';

export const appRoutes = [
  { path: '', redirectTo: '/elephants', pathMatch: 'full' },
  { path: 'elephants', component: ElephantPageComponent },
  { path: 'lions', component: LionPageComponent },
  { path: 'feedback', component: FeedbackFormComponent },
];
