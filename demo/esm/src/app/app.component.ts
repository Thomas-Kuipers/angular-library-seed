import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<div><div *ifAdaptive="{devices: ['desktop']}">desktop</div></div>`
})
export class AppComponent {
  public header: string = 'UMD Demo';
}
