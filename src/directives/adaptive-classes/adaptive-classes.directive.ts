import {
  Directive,
  Input,
  ElementRef,
  OnInit,
  Renderer2,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';
import {AdaptiveService, AdaptiveConditions} from '../../services/adaptive/adaptive.service';

export interface AdaptiveClassesInterface {
  [name: string]: AdaptiveConditions;
}

/**
 * Adds css classes based on specified conditions about device, screen width and
 * orientation (landscape/portrait).
 *
 * Example usage 1:
 * <div [adaptiveClasses]="{mySmallFontClass: {maxScreenWidth: 's', orientation: 'landscape', devices: ['desktop']}}"></div>
 * The class 'mySmallFontClass' will only be used if all these conditions are true: (AND)
 *  - the screen width is small (check the ResponsiveService for more info on what is small exactly)
 *  - the device is a desktop
 *  - the user is in landscape mode
 *
 * Example usage 2:
 * <div [adaptiveClasses]="{largeFont: {minScreenWidth: 'normal'}}"></div>
 * The class 'largeFont' will be used if the screen width is normal. It doesn't matter what kind
 * of device is being used or what the orientation mode is.
 *
 * Example usage 3:
 * <div [adaptiveClasses]="{largeFont: {minScreenWidth: 'normal'}, fatFingers: {devices: ['tablet','mobile']}"></div>
 * The class 'largeFont' will be used if the screen width is normal.
 * The class 'fatFingers' will be used if the device is either tablet or mobile.
 *
 */
@Directive({
  selector: '[adaptiveClasses]'
})
export class AdaptiveClassesDirective implements OnInit, OnDestroy {
  @Input('adaptiveClasses') public adaptiveClasses: AdaptiveClassesInterface;

  private subscriptions: Subscription[] = [];

  constructor(
    private hostElement: ElementRef,
    private renderer: Renderer2,
    private adaptiveService: AdaptiveService
  ) {}

  public ngOnInit() {
    const classNames: string[] = Object.keys(this.adaptiveClasses);

    classNames.forEach((className) => {
      const classConditions = this.adaptiveClasses[className];

      const subscription = this.adaptiveService
        .validate(classConditions)
        .subscribe((result) => this.onValidated(result, className));

      this.subscriptions.push(subscription);
    });
  }

  /**
   * We have a separate subscription for every css class, so now we need to unsubscribe for all of them.
   */
  public ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  private onValidated(result: boolean, className: string) {
    if (result) {
      // All the specified conditions were met, now add the class
      this.renderer.addClass(this.hostElement.nativeElement, className);
    } else {
      // Remove the class in case it was maybe already there because it used
      // to match the conditions, but now the user resized his screen and it doesn't
      // match the conditions anymore.
      this.renderer.removeClass(this.hostElement.nativeElement, className);
    }
  }
}
