import {NgModule, ModuleWithProviders, Provider, InjectionToken} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdaptiveService } from './services';
import { AdaptiveClassesDirective } from './directives';
import { IfAdaptiveDirective } from './directives';
import { SCREEN_WIDTHS } from './services';
import {DeviceHelper} from "./helpers/device.helper";
import {OrientationHelper} from "./helpers/orientation.helper";

export interface AdaptiveModuleConfig {
  screenWidths?: any;
}

export const defaultScreenWidths = {wat: 'dat'};


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
    IfAdaptiveDirective
  ],
  exports: [
    AdaptiveClassesDirective,
    IfAdaptiveDirective
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
        { provide: SCREEN_WIDTHS, useValue: config.screenWidths }
      ]
    };
  }
}
