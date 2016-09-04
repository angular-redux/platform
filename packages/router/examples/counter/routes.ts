import { Injectable, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { AppComponent, FirstComponent, SecondComponent, ThirdComponent } from './containers/app.component';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate() {
    return confirm("Activate?");
  }
}

const routes: Routes = [
  {
    path: '',
    redirectTo: '/first',
    pathMatch: 'full'
  },
  {
    path: 'first',
    component: FirstComponent
  },
  {
    path: 'second',
    component: SecondComponent
  },
  {
    path: 'third',
    component: ThirdComponent,
    canActivate: [AuthGuard]
  }
];

export const routing = RouterModule.forRoot(routes);
