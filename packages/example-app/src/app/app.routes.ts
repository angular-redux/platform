import { ElephantsPageComponent } from './elephants/elephants-page.container';
import { LionsPageComponent } from './lions/lions-page.container';
import { FeedbackFormComponent } from './feedback/feedback-form/feedback-form.component';

export const appRoutes = [
  { path: '', redirectTo: '/elephants', pathMatch: 'full' },
  { path: 'elephants', component: ElephantsPageComponent },
  { path: 'lions', component: LionsPageComponent },
  { path: 'feedback', component: FeedbackFormComponent },
];
