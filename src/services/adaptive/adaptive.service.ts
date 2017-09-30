import { Injector, InjectionToken } from '@angular/core';

export const SCREEN_WIDTHS = new InjectionToken('SCREEN_WIDTHS');
export const USER_AGENT_STRING = new InjectionToken<string>('USER_AGENT_STRING');
export const DEBOUNCE_TIME = new InjectionToken<number>('DEBOUNCE_TIME');
export const SCREEN_WIDTH_BREAKPOINTS = new InjectionToken<ScreenWidthSpec[]>('SCREEN_WIDTH_BREAKPOINTS');

import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import * as MobileDetect from 'mobile-detect';
import {Observer} from "rxjs/Observer";
import {DeviceHelper, Device} from "../../helpers/device/device.helper";
import {OrientationHelper, Orientation} from "../../helpers/orientation/orientation.helper";
import {ScreenWidthSpec, ScreenWidthHelper} from "../../helpers/screen-width/screen-width.helper";

export type ScreenWidth = 'small' | 'normal' | 'large';
export type Browser = 'chrome' | 'firefox';

export type functionType = (wat: number) => boolean;

export type AdaptiveRule = {name: string, conditions: AdaptiveConditions};
export type AdaptiveRules = AdaptiveRule[];

export interface AdaptiveConditions {
  devices?: [Device];
  minScreenWidth?: string | number;
  maxScreenWidth?: string | number;
  orientation?: Orientation;
  browsers?: [Browser];
  custom?: boolean | functionType | Observable<boolean> | Promise<boolean>;
  rules?: AdaptiveRules;
}

declare let window: any;

@Injectable()
export class AdaptiveService {
  public changes: Observable<[Device, ScreenWidth, Orientation]>;

  constructor
  (
    private deviceHelper: DeviceHelper,
    private orientationHelper: OrientationHelper,
    private screenWidthHelper: ScreenWidthHelper
  ) {}

  public validate(conditions: AdaptiveConditions): Observable<boolean> {
    let activeConditions: Observable<boolean>[] = [];

    if (conditions.devices) {
      activeConditions.push(this.deviceHelper.validate(conditions.devices));
    }

    if (conditions.orientation) {
      activeConditions.push(this.orientationHelper.validate(conditions.orientation));
    }

    if (conditions.minScreenWidth) {
      activeConditions.push(this.screenWidthHelper.validateMin(conditions.minScreenWidth));
    }

    if (conditions.maxScreenWidth) {
      activeConditions.push(this.screenWidthHelper.validateMax(conditions.maxScreenWidth));
    }

    // Check that there no false results in any of the observables
    return Observable
      .combineLatest(activeConditions)
      .map((results) => results.indexOf(false) === -1);
  }
}
