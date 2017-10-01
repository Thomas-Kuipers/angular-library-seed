import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `<div>vbfhdsb<div *ifMinScreenWidth="'s'" [adaptiveClasses]="{yolo: {minScreenWidth: 100}}">dit ziue je allaseen als screenwidth > s</div></div>`
})
export class AppComponent {
  public header: string = 'UMD Demo';
}
