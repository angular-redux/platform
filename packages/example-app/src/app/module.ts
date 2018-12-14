import { NgReduxRouterModule } from '@angular-redux/router';
import { NgReduxModule } from '@angular-redux/store';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

// This app's ngModules
import { AnimalModule } from './animals/module';
import { ElephantModule } from './elephants/module';
import { FeedbackModule } from './feedback/module';
import { LionModule } from './lions/module';
import { StoreModule } from './store/module';

// Top-level app component constructs.
import { AppComponent } from './component';
import { appRoutes } from './routes';

@NgModule({
  declarations: [AppComponent],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgReduxModule,
    NgReduxRouterModule.forRoot(),
    AnimalModule,
    ElephantModule,
    LionModule,
    FeedbackModule,
    StoreModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
