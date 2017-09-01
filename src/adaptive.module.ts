import {NgModule, ModuleWithProviders, Provider, InjectionToken} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdaptiveService } from './services';
import { AdaptiveClassesDirective } from './';
import { IfAdaptiveDirective } from './';
import { SCREEN_WIDTHS } from './services';
import { USER_AGENT_STRING } from './services';
import {DeviceHelper} from "./helpers/device.helper";
import {OrientationHelper} from "./helpers/orientation.helper";
import {IfDevicesDirective} from "./directives/if-devices/if-devices.directive";

export interface AdaptiveModuleConfig {
  screenWidths?: any;
  userAgentString?: string;
}

export const defaultScreenWidths = {wat: 'dat'};

let defaultUserAgentString: string = '';

if (window && window.navigator && window.navigator.userAgent) {
  defaultUserAgentString = window.navigator.userAgent;
}

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    AdaptiveService,
    {provide: SCREEN_WIDTHS, useValue: defaultScreenWidths}
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
        { provide: SCREEN_WIDTHS, useValue: config.screenWidths || defaultScreenWidths },
        { provide: USER_AGENT_STRING, useValue: config.userAgentString || defaultUserAgentString }
      ]
    };
  }
} //
