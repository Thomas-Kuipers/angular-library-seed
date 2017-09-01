import {NgModule, ModuleWithProviders, Provider, InjectionToken} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdaptiveService } from './services';
import { AdaptiveClassesDirective } from './';
import { IfAdaptiveDirective } from './';
import { USER_AGENT_STRING } from './services';
import { DEBOUNCE_TIME } from './services';
import { SCREEN_WIDTH_BREAKPOINTS } from './services';
import {DeviceHelper} from "./helpers/device.helper";
import {OrientationHelper} from "./helpers/orientation.helper";
import {IfDevicesDirective} from "./directives/if-devices/if-devices.directive";
import {ScreenWidthSpec} from "./helpers/screen-width.helper";

export interface AdaptiveModuleConfig {
  userAgentString?: string;
  debounceTime?: number;
  screenWidthBreakpoints?: ScreenWidthSpec[];
}

export const defaultScreenWidths: ScreenWidthSpec[] = [
  {max: 575, name: 'xs'},
  {max: 767, name: 's'},
  {max: 991, name: 'm'},
  {max: 1199, name: 'l'},
  {max: null, name: 'xl'}
];

let defaultUserAgentString: string = '';

if (window && window.navigator && window.navigator.userAgent) {
  defaultUserAgentString = window.navigator.userAgent;
}

export const defaultDebounceTime = 500;

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    AdaptiveService
  ],
  declarations: [
    AdaptiveClassesDirective,
    IfAdaptiveDirective,
    IfDevicesDirective
  ],
  exports: [
    AdaptiveClassesDirective,
    IfAdaptiveDirective,
    IfDevicesDirective
  ]
})
export class AdaptiveModule {
  public static forRoot(config: AdaptiveModuleConfig = {}): ModuleWithProviders {
    return {
      ngModule: AdaptiveModule,
      providers: [
        DeviceHelper,
        OrientationHelper,
        AdaptiveService,
        { provide: USER_AGENT_STRING, useValue: config.userAgentString || defaultUserAgentString },
        { provide: DEBOUNCE_TIME, useValue: config.debounceTime || defaultDebounceTime },
        { provide: SCREEN_WIDTH_BREAKPOINTS, useValue: config.screenWidthBreakpoints || defaultScreenWidths }
      ]
    };
  }
}
