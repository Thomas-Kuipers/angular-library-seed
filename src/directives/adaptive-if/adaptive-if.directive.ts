import {Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {AdaptiveService} from '../../services';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[adaptive-if]'
})
export class AdaptiveIfDirective implements OnInit, OnDestroy {
  @Input('adaptive-if') public adaptiveIf: any;

  private hasView: boolean = false;
  private conditionsSubscription: Subscription;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private adaptiveService: AdaptiveService
  ) {}

  public ngOnInit() {
    this.conditionsSubscription = this.adaptiveService
      .checkConditions(this.adaptiveIf)
      .subscribe((result) => this.onCheckConditions(result));
  }

  public ngOnDestroy() {
    if (this.conditionsSubscription) {
      this.conditionsSubscription.unsubscribe();
    }
  }

  private onCheckConditions(result: boolean) {
    if (result && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!result && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
