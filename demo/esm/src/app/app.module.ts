import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { AdaptiveModule } from '../../lib';

@NgModule({
  imports: [
    BrowserModule,
    AdaptiveModule.forRoot({
      screenWidths: 'for de root jwz'
    })
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
