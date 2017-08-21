import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<div [adaptive-classes]="'yoblo'"><div [adaptive-if]="'hoi'"></div></div>`
})
export class AppComponent {
  public header: string = 'UMD Demo';
}
