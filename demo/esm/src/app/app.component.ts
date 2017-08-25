import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<div [adaptive-classes]="'yoblo'"><div [ifAdaptive]="'hoi'"></div></div>`
})
export class AppComponent {
  public header: string = 'UMD Demo';
}
