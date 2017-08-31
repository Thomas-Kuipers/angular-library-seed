import {Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {AdaptiveConditions} from '../../services';
import {IfBaseDirective, IfInterface} from '../if-base/if-base';
import {AdaptiveService} from '../../services/adaptive/adaptive.service';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[ifAdaptive]'
})
export class IfAdaptiveDirective extends IfBaseDirective implements IfInterface {
  @Input('ifAdaptive') public ifAdaptive: AdaptiveConditions;

  public conditions: AdaptiveConditions;

  constructor(
    templateRef: TemplateRef<any>,
    viewContainer: ViewContainerRef,
    adaptiveService: AdaptiveService
  ) {
    super(templateRef, viewContainer, adaptiveService);
  }

  public ngOnInit() {
    this.conditions = this.ifAdaptive;
    this.onInit();
  }

  public ngOnDestroy() {
    this.onDestroy();
  }
}
