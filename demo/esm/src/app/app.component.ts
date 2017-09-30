import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<div><div *ifAdaptive="{maxScreenWidth: 's'}">desktop</div></div>`
})
export class AppComponent {
  public header: string = 'UMD Demo';
}
