import {Injectable, Directive,
Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef, Injector} from '@angular/core';
import {AdaptiveService, AdaptiveConditions} from '../../services';
import {Subscription} from 'rxjs';

export interface IfInterface {
  conditions: AdaptiveConditions;
  ngOnInit(): void;
  ngOnDestroy(): void;
}

@Directive({
  selector: '[ifBase]'
})
export class IfBaseDirective {
  protected conditions: AdaptiveConditions;

  private hasView: boolean = false;
  private conditionsSubscription: Subscription;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private adaptiveService: AdaptiveService
  ) {}

  public onInit() {
    console.log(this.adaptiveService);

    this.conditionsSubscription = this.adaptiveService
      .checkConditions(this.conditions)
      .subscribe((result) => this.onCheckConditions(result));
  }

  public onDestroy() {
    if (this.conditionsSubscription) {
      this.conditionsSubscription.unsubscribe();
    }
  }

  private onCheckConditions(result: boolean) {
    if (result && !this.hasView) {
      this.initElement();
    } else if (!result && this.hasView) {
      this.destroyElement();
    }
  }

  private initElement() {
    this.viewContainer.createEmbeddedView(this.templateRef);
    this.hasView = true;
  }

  private destroyElement() {
    this.viewContainer.clear();
    this.hasView = false;
  }
}
