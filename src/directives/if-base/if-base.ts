import {Injectable, Directive,
Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef, Injector} from '@angular/core';
import {AdaptiveService, AdaptiveConditions} from '../../services';
import {Subscription} from 'rxjs';

export interface IfInterface {
  ngOnInit(): void;
  ngOnDestroy(): void;
  ngOnChanges(changes): void;
}

export abstract class IfBaseDirective {
  private hasView: boolean = false;
  private validationSubscription: Subscription;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private adaptiveService: AdaptiveService
  ) {}

  protected init(conditions: AdaptiveConditions) {
    this.validationSubscription = this.adaptiveService
      .validate(conditions)
      .subscribe((result) => this.onValidated(result));
  }

  protected destroy() {
    if (this.validationSubscription) {
      this.validationSubscription.unsubscribe();
    }
  }

  private onValidated(result: boolean) {
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
