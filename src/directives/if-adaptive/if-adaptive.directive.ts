import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AdaptiveConditions, AdaptiveService} from '../../services/adaptive/adaptive.service';
import {IfBaseDirective, IfInterface} from '../if-base/';

@Directive({
  selector: '[ifAdaptive]'
})
export class IfAdaptiveDirective extends IfBaseDirective implements IfInterface {
  @Input('ifAdaptive') public ifAdaptive: AdaptiveConditions;

  constructor(
    templateRef: TemplateRef<any>,
    viewContainer: ViewContainerRef,
    adaptiveService: AdaptiveService
  ) {
    super(templateRef, viewContainer, adaptiveService);
  }

  public ngOnInit() {
    this.init(this.ifAdaptive);
  }

  public ngOnDestroy() {
    this.destroy();
  }

  public ngOnChanges(changes) {

  }
}
