import { Injector, InjectionToken } from '@angular/core';

export const SCREEN_WIDTHS = new InjectionToken('SCREEN_WIDTHS');
export const USER_AGENT_STRING = new InjectionToken<string>('USER_AGENT_STRING');

import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import * as MobileDetect from 'mobile-detect';
import {Observer} from "rxjs/Observer";
import {DeviceHelper, Device} from "../../helpers/device.helper";
import {OrientationHelper, Orientation} from "../../helpers/orientation.helper";

export type ScreenWidth = 'small' | 'normal' | 'large';
export type Browser = 'chrome' | 'firefox';

export type functionType = (wat: number) => boolean;

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
// const screenWidths: ScreenWidthSpec[] = [
//   {
//     max: 1024,
//     name: 'small'
//   },
//   {
//     max: 1200,
//     name: 'normal'
//   },
//   {
//     name: 'large'
//   }
// ];

@Injectable()
export class AdaptiveService {
  public changes: Observable<[Device, ScreenWidth, Orientation]>;

  constructor
  (
    private deviceHelper: DeviceHelper,
    private orientationHelper: OrientationHelper
  ) {}

  public validate(conditions: AdaptiveConditions): Observable<boolean> {
    let activeConditions: Observable<boolean>[] = [];

    if (conditions.devices) {
      activeConditions.push(this.deviceHelper.validate(conditions.devices));
    }

    if (conditions.orientation) {
      activeConditions.push(this.orientationHelper.validate(conditions.orientation));
    }

    // Check that there no false results in any of the observables
    return Observable
      .combineLatest(activeConditions)
      .map(results => results.indexOf(false) === -1);
  }
}
