import { Injectable, Injector, InjectionToken } from '@angular/core';

export const SCREEN_WIDTHS = new InjectionToken('SCREEN_WIDTHS');

import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import * as MobileDetect from 'mobile-detect';

export type ScreenWidth = 'small' | 'normal' | 'large';
export type Device = 'mobile' | 'tablet' | 'desktop';
export type Orientation = 'landscape' | 'portrait';

export interface ResponsiveConditions {
  device?: Device | [Device];
  minScreenWidth?: ScreenWidth;
  maxScreenWidth?: ScreenWidth;
  orientation?: Orientation;
}

interface ScreenWidthSpec {
  min?: number;
  max?: number;
  name: ScreenWidth;
}

/**
 * The order of screen width specs matters, because of being able to specify a minScreenWidth and
 * a maxScreenWidth.
 */
const screenWidths: ScreenWidthSpec[] = [
  {
    max: 1024,
    name: 'small'
  },
  {
    min: 1025,
    max: 1200,
    name: 'normal'
  },
  {
    min: 1201,
    name: 'large'
  }
];

@Injectable()
export class AdaptiveService {
  public changes: Observable<[Device, ScreenWidth, Orientation]>;

  private screenWidth = new ReplaySubject<ScreenWidth>();
  private device = new ReplaySubject<Device>();
  private orientation = new ReplaySubject<Orientation>();
  private activeScreenWidth: ScreenWidth;
  private activeDevice: Device;
  private activeOrientation: Orientation;

  constructor() {
    // Combine all the observables into one
    this.changes = Observable.combineLatest(
      this.device,
      this.screenWidth,
      this.orientation
    ).debounceTime(500);

    this.changes.subscribe((changes) => {
      console.log('Device:', changes[0]);
      console.log('Screen width:', changes[1]);
      console.log('Orientation:', changes[2]);
    });

    this.checkDevice();

    this.checkScreenWidth();
    window.addEventListener('resize', () => this.checkScreenWidth());

    // We can only check the orientation once we've checked the device first
    this.device.subscribe(device => {
      this.checkOrientation(device);
      window.addEventListener('orientationchange', () =>
        this.checkOrientation(device)
      );
    });
  }

  private checkScreenWidth() {
    const spec = this.getScreenWidthSpec(window.innerWidth);

    if (spec.name !== this.activeScreenWidth) {
      this.activeScreenWidth = spec.name;
      this.screenWidth.next(spec.name);
    }
  }

  private getScreenWidthSpec(width: number): ScreenWidthSpec {
    return screenWidths.find(spec => {
      if (spec.min && width < spec.min) {
        return false;
      } else if (spec.max && width > spec.max) {
        return false;
      } else {
        return true;
      }
    });
  }

  private getScreenWidthSpecByName(name: ScreenWidth): ScreenWidthSpec {
    return screenWidths.find(spec => spec.name === name);
  }

  private checkMinScreenWidth(min: ScreenWidth, active: ScreenWidth): boolean {
    const activeSpec = this.getScreenWidthSpecByName(active),
      minSpec = this.getScreenWidthSpecByName(min);

    return screenWidths.indexOf(activeSpec) >= screenWidths.indexOf(minSpec);
  }

  private checkMaxScreenWidth(max: ScreenWidth, active: ScreenWidth): boolean {
    const activeSpec = this.getScreenWidthSpecByName(active),
      maxSpec = this.getScreenWidthSpecByName(max);

    return screenWidths.indexOf(activeSpec) <= screenWidths.indexOf(maxSpec);
  }

  private checkOrientation(device: Device) {
    let orientation: Orientation;

    if (device === 'desktop') {
      orientation = 'landscape';
    } else if (window.screen && window.screen['orientation']) {
      // window.screen.orientation is available on most browsers
      if (
        window.screen['orientation'].type === 'portrait-primary' ||
        window.screen['orientation'].type === 'portrait-secondary'
      ) {
        orientation = 'portrait';
      } else {
        orientation = 'landscape';
      }
    } else if (typeof window.orientation === 'number') {
      // The window.orientation property is only available on iOS
      if (window.orientation === 0 || window.orientation === 180) {
        orientation = 'portrait';
      } else {
        orientation = 'landscape';
      }
    } else {
      // If we have no way to detect, we assume landscape
      orientation = 'landscape';
    }

    if (orientation !== this.activeOrientation) {
      this.activeOrientation = orientation;
      this.orientation.next(orientation);
    }
  }

  private checkDevice() {
    let device: Device;

    const md = new MobileDetect(window.navigator.userAgent);

    if (md.tablet()) {
      device = 'tablet';
    } else if (md.mobile()) {
      device = 'mobile';
    } else {
      device = 'desktop';
    }

    if (device !== this.activeDevice) {
      this.activeDevice = device;
      this.device.next(device);
    }
  }

  public checkConditions(
    conditions: ResponsiveConditions
  ): Observable<boolean> {
    return Observable.create(observer => {
      const changeSubscription = this.changes.subscribe(changes => {
        const activeDevice: Device = changes[0],
          activeScreenWidth: ScreenWidth = changes[1],
          activeOrientation: Orientation = changes[2];

        let result: boolean = true;

        // If we have maxScreenWidth as a condition,
        // check if the current screen width isn't higher
        if (conditions.maxScreenWidth) {
          if (
            !this.checkMaxScreenWidth(
              conditions.maxScreenWidth,
              activeScreenWidth
            )
          ) {
            result = false;
          }
        }

        // If we have minScreenWidth as a condition,
        // check if the current screen width isn't lower
        if (conditions.minScreenWidth) {
          if (
            !this.checkMinScreenWidth(
              conditions.minScreenWidth,
              activeScreenWidth
            )
          ) {
            result = false;
          }
        }

        // If we have orientation as a condition, check if it matches the active orientation
        if (
          conditions.orientation &&
          conditions.orientation !== activeOrientation
        ) {
          result = false;
        }

        // If we have device as a condition, check if it matches the active device
        if (conditions.device) {
          // The device condition is a special case, because we can allow multiple devices
          // like this, {myClassName: {device: ["tablet","mobile"]}}
          // So we first check if we're using an array of devices or not
          if (
            conditions.device instanceof Array &&
            conditions.device.indexOf(activeDevice) === -1
          ) {
            result = false;
          } else if (
            !(conditions.device instanceof Array) &&
            conditions.device !== activeDevice
          ) {
            result = false;
          }
        }

        observer.next(result);

        return () => {
          changeSubscription.unsubscribe();
        };
      });
    });
  }
}
