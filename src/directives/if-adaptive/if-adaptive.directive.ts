import {Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {AdaptiveConditions} from '../../services';
import {IfBaseDirective} from '../if-base/if-base';
import {AdaptiveService} from '../../services/adaptive/adaptive.service';

@Directive({
  selector: '[ifAdaptive]'
})
export class IfAdaptiveDirective extends IfBaseDirective {
  @Input('ifAdaptive') public ifAdaptive: AdaptiveConditions;

  constructor(
    protected templateRef: TemplateRef<any>,
    protected viewContainer: ViewContainerRef,
    protected adaptiveService: AdaptiveService
  ) {
    super(templateRef, viewContainer, adaptiveService);
  }

  public ngOnInit() {
    this.conditions = this.ifAdaptive;
    super.ngOnInit();
  }
}
