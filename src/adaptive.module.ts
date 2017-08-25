import {NgModule, ModuleWithProviders, Provider, InjectionToken} from '@angular/core';
import { AdaptiveService } from './services';
import { AdaptiveClassesDirective } from './directives';
import { IfAdaptiveDirective } from './directives';
import { SCREEN_WIDTHS } from './services';

export interface AdaptiveModuleConfig {
  screenWidths?: any;
}

export const defaultScreenWidths = {wat: 'dat'};


@NgModule({
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
        { provide: SCREEN_WIDTHS, useValue: config.screenWidths }
      ]
    };
  }
}
