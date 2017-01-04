import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgReduxModule } from 'ng2-redux';

import { AppComponent } from './app.component';
import { AppActions } from './app.actions';

import { ElephantsModule } from './elephants/elephants.module';
import { LionsModule } from './lions/lions.module';

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgReduxModule,
    ElephantsModule,
    LionsModule,
  ],
  providers: [ AppActions ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
