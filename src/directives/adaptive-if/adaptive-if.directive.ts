import { Directive, Input, OnInit } from '@angular/core';
import {AdaptiveService} from "../../services";

@Directive({
  selector: '[adaptive-if]'
})
export class AdaptiveIfDirective implements OnInit {
  @Input('adaptive-if') adaptiveIf: any;

  constructor(private adaptiveService: AdaptiveService) {}

  ngOnInit() {
    console.log(this.adaptiveIf);
    // console.log(this.adaptiveService)
  }
}
