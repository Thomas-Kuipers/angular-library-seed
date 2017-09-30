import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<div>vbfhdsb<div *ifMinScreenWidth="'s'">dit ziue je alleen als screenwidth > s</div></div>`
})
export class AppComponent {
  public header: string = 'UMD Demo';
}
