import { Directive, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[adaptive-if]'
})
export class AdaptiveIfDirective implements OnInit {
  @Input('adaptive-if') adaptiveIf: any;

  ngOnInit() {
    console.log(this.adaptiveIf);
  }
}
