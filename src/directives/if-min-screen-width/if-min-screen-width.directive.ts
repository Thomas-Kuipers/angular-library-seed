import {Directive, Input, SimpleChanges, TemplateRef, ViewContainerRef} from '@angular/core';
import {AdaptiveConditions, AdaptiveService} from '../../services/adaptive/adaptive.service';
import {IfBaseDirective, IfInterface} from '../if-base/';

@Directive({
  selector: '[ifMinScreenWidth]'
})
export class IfMinScreenWidthDirective extends IfBaseDirective implements IfInterface {
  @Input('ifMinScreenWidth') public ifMinScreenWidth: number | string;

  public conditions: AdaptiveConditions;

  constructor(
    templateRef: TemplateRef<any>,
    viewContainer: ViewContainerRef,
    adaptiveService: AdaptiveService
  ) {
    super(templateRef, viewContainer, adaptiveService);
  }

  public ngOnInit() {
    this.init({minScreenWidth: this.ifMinScreenWidth});
  }

  public ngOnDestroy() {
    this.destroy();
  }

  public ngOnChanges(changes: SimpleChanges) {}
}
