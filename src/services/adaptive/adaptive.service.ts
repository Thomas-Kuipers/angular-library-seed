import { Injector, InjectionToken } from '@angular/core';

export const SCREEN_WIDTHS = new InjectionToken('SCREEN_WIDTHS');

import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import * as MobileDetect from 'mobile-detect';
import {Observer} from "rxjs/Observer";

export type ScreenWidth = 'small' | 'normal' | 'large';
export type Device = 'mobile' | 'tablet' | 'desktop';
export type Orientation = 'landscape' | 'portrait';
export type Browser = 'chrome' | 'firefox';

type functionType = (wat: number) => boolean;

export type AdaptiveRule = {name: string, conditions: AdaptiveConditions};
export type AdaptiveRules = AdaptiveRule[];

export interface AdaptiveConditions {
  devices?: [Device];
  screenWidths?: [ScreenWidth];
  minScreenWidth?: ScreenWidth | number;
  maxScreenWidth?: ScreenWidth | number;
  orientation?: Orientation;
  browsers?: [Browser];
  custom?: boolean | functionType | Observable<boolean> | Promise<boolean>;
  rules?: AdaptiveRules;
}

interface ScreenWidthSpec {
  max?: number;
  name: ScreenWidth;
}

declare let window: any;

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
    max: 1200,
    name: 'normal'
  },
  {
    name: 'large'
  }
];

@Injectable()
export class AdaptiveService {
  public changes: Observable<[Device, ScreenWidth, Orientation]>;

  private screenWidth = new ReplaySubject<ScreenWidth>();
  private device = new ReplaySubject<Device>();
  private orientation = new ReplaySubject<Orientation>();

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

  public checkConditions(
    conditions: AdaptiveConditions
  ): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      const changeSubscription = this.changes.subscribe((changes) => {
        const activeDevice: Device = changes[0];
        const activeScreenWidth: ScreenWidth = changes[1];
        const activeOrientation: Orientation = changes[2];

        let result: boolean = true;

        // If we have maxScreenWidth as a condition,
        // check if the current screen width isn't higher
        if
        (
          conditions.maxScreenWidth &&
          typeof conditions.maxScreenWidth === 'number'
        ) {
          result = false;
        }
        else if
        (
          conditions.maxScreenWidth &&
          typeof conditions.maxScreenWidth === 'string' &&
          !this.checkMaxScreenWidth(conditions.maxScreenWidth, activeScreenWidth)
        ) {
          result = false;
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
        if (
          conditions.devices &&
          conditions.devices.indexOf(activeDevice) === -1
        ) {
          result = false;
        }

        observer.next(result);

        return () => {
          changeSubscription.unsubscribe();
        };
      });
    });
  }

  private checkScreenWidth() {
    const spec = this.getScreenWidthSpec(window.innerWidth);

    if (spec.name !== this.activeScreenWidth) {
      this.activeScreenWidth = spec.name;
      this.screenWidth.next(spec.name);
    }
  }

  /**
   * Will find the first spec that's lower than the width.
   *
   * This works because the specs are ordered by max screen width.
   *
   * @param width
   * @returns {undefined|ScreenWidthSpec}
   */
  private getScreenWidthSpec(width: number): ScreenWidthSpec {
    return screenWidths.find(spec => spec.max < width);
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

    this.orientation
      .take(1)
      .filter(oldOrientation => oldOrientation !== orientation)
      .subscribe(() => this.orientation.next(orientation));
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

    this.device
      .take(1)
      .filter(oldDevice => oldDevice !== device)
      .subscribe(() => this.device.next(device));
  }
}
