import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';

import { AdaptiveModule } from '../../lib/adaptive.module';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    AdaptiveModule.forRoot({
      screenWidths: 'for de root jwz'
    })
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
