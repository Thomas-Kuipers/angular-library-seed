import {
  Directive,
  Input,
  ElementRef,
  OnInit,
  Renderer2,
  OnDestroy
} from '@angular/core';
import { Subscription } from 'rxjs';
import {AdaptiveService} from '../../';

/**
 * Adds css classes based on specified conditions about device, screen width and
 * orientation (landscape/portrait).
 *
 * Example usage 1:
 * <div [responsiveClasses]="{mySmallFontClass: {maxScreenWidth: 'small', orientation: 'landscape', device: 'desktop'}}"></div>
 * The class 'mySmallFontClass' will only be used if all these conditions are true: (AND)
 *  - the screen width is small (check the ResponsiveService for more info on what is small exactly)
 *  - the device is a desktop
 *  - the user is in landscape mode
 *
 * Example usage 2:
 * <div [responsiveClasses]="{largeFont: {minScreenWidth: 'normal'}}"></div>
 * The class 'largeFont' will be used if the screen width is normal. It doesn't matter what kind
 * of device is being used or what the orientation mode is.
 *
 * Example usage 3:
 * <div [responsiveClasses]="{largeFont: {minScreenWidth: 'normal'}, fatFingers: {device: ['tablet','mobile']}"></div>
 * The class 'largeFont' will be used if the screen width is normal.
 * The class 'fatFingers' will be used if the device is either tablet or mobile.
 *
 */
@Directive({
  selector: '[adaptive-classes]'
})
export class AdaptiveClassesDirective implements OnInit, OnDestroy {
  @Input('adaptive-classes') public adaptiveClasses: any;

  private subscriptions: Subscription[] = [];

  constructor(
    private hostElement: ElementRef,
    private renderer: Renderer2,
    private adaptiveService: AdaptiveService
  ) {}

  public ngOnInit() {
    Object.keys(this.adaptiveClasses).forEach((className) => {
      const classConditions = this.adaptiveClasses[className];

      const subscription = this.adaptiveService
        .checkConditions(classConditions)
        .subscribe(result => this.onCheckConditions(result, className));

      this.subscriptions.push(subscription);
    });
  }

  public ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  private onCheckConditions(result: boolean, className: string) {
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
