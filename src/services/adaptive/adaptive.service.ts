import { Injectable, Injector, InjectionToken } from '@angular/core';

export const SCREEN_WIDTHS = new InjectionToken('SCREEN_WIDTHS');

@Injectable()
export class AdaptiveService {
  constructor(private injector: Injector) {
    const config = injector.get(SCREEN_WIDTHS);
    console.log(config);
  }

  public imADick() {
    return false;
  }
}
