import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { routing, AuthGuard } from '../routes';
import { NgReduxModule } from 'ng2-redux';
import { NgReduxRouter } from 'ng2-redux-router';
import { Counter } from '../components/Counter';
import { CounterInfo } from '../components/CounterInfo';

import { AppComponent, FirstComponent, SecondComponent, ThirdComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    routing,
    NgReduxModule
  ],
  declarations: [
    AppComponent,
    FirstComponent,
    SecondComponent,
    ThirdComponent,
    Counter,
    CounterInfo
  ],
  providers: [
    NgReduxRouter,
    AuthGuard
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
