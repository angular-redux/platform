import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { NgReduxModule } from '@angular-redux/store';
import { NgReduxRouterModule } from '@angular-redux/router';

import { appRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { AppActions } from './app.actions';

import { ElephantsModule } from './elephants/elephants.module';
import { LionsModule } from './lions/lions.module';
import { FeedbackModule } from './feedback/feedback.module';

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    HttpModule,
    NgReduxModule,
    NgReduxRouterModule,
    ElephantsModule,
    LionsModule,
    FeedbackModule,
  ],
  providers: [ AppActions ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
