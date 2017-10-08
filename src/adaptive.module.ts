import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdaptiveRule, AdaptiveService} from './services/adaptive/adaptive.service';
import {AdaptiveClassesDirective} from './directives/adaptive-classes';
import {IfAdaptiveDirective} from './directives/if-adaptive';
import {DeviceHelper} from "./helpers/device/device.helper";
import {OrientationHelper} from "./helpers/orientation/orientation.helper";
import {IfDevicesDirective} from "./directives/if-devices/if-devices.directive";
import {ScreenWidthHelper, ScreenWidthSpec} from "./helpers/screen-width/screen-width.helper";
import {IfMinScreenWidthDirective} from "./directives/if-min-screen-width/if-min-screen-width.directive";
import {WindowRefHelper} from "./helpers/window-ref/window-ref";
import {ADAPTIVE_RULES, DEBOUNCE_TIME, SCREEN_WIDTH_BREAKPOINTS, USER_AGENT_STRING} from "./injection-tokens";

export interface AdaptiveModuleConfig {
  userAgentString?: string;
  debounceTime?: number;
  screenWidthBreakpoints?: ScreenWidthSpec[];
  adaptiveRules?: AdaptiveRule[];
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
    IfDevicesDirective,
    IfMinScreenWidthDirective
  ],
  exports: [
    AdaptiveClassesDirective,
    IfAdaptiveDirective,
    IfDevicesDirective,
    IfMinScreenWidthDirective
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
        ScreenWidthHelper,
        WindowRefHelper,
        { provide: USER_AGENT_STRING, useValue: config.userAgentString || defaultUserAgentString },
        { provide: DEBOUNCE_TIME, useValue: config.debounceTime || defaultDebounceTime },
        { provide: SCREEN_WIDTH_BREAKPOINTS, useValue: config.screenWidthBreakpoints || defaultScreenWidths },
        { provide: ADAPTIVE_RULES, useValue: config.adaptiveRules }
      ]
    };
  }
}
