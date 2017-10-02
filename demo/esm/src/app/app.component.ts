import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <div [adaptiveClasses]="{red: {minScreenWidth: 'm'}}">This text will be red if screen width > m</div>
  `
})
export class AppComponent {}
