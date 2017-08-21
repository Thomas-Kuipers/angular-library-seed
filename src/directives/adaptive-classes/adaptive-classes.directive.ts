import { Directive, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[adaptive-classes]'
})
export class AdaptiveClassesDirective implements OnInit {
  @Input('adaptive-classes') adaptiveClasses: any;

  ngOnInit() {
    console.log(this.adaptiveClasses);
  }
}
