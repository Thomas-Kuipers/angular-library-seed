import {Injectable, Injector} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import {USER_AGENT_STRING} from "../../injection-tokens";
import * as MobileDetect from 'mobile-detect';

export type Browser =
  'Chrome' |
  'Dolfin' |
  'Opera' |
  'Skyfire' |
  'Edge' |
  'IE' |
  'Firefox' |
  'Bolt' |
  'TeaShark' |
  'Blazer' |
  'Safari' |
  'UCBrowser' |
  'baiduboxapp' |
  'baidubrowser' |
  'DiigoBrowser' |
  'Puffin' |
  'Mercury' |
  'ObigoBrowser' |
  'NetFront' |
  'GenericBrowser' |
  'PaleMoon';

@Injectable()
export class BrowserHelper {
  private active = new BehaviorSubject<Browser>(undefined);

  private userAgentString: string;

  constructor(injector: Injector) {
    this.userAgentString = injector.get(USER_AGENT_STRING);
    this.check();
  }

  /**
   * Checks whether one of the devices in the supplied device array matches the active device of the client.
   *
   * @param {[Device]} test An array of devices that are okay. If one of the devices matches the active device,
   * it will emit true.
   * @returns {Observable<boolean>}
   */
  public validate(test: [Browser]): Observable<boolean> {
    return this.active.map(active => test.indexOf(active) !== -1);
  }

  private check() {
    const md = new MobileDetect(this.userAgentString);
    const browser: Browser = <Browser>md.userAgent();

    this.active
      .take(1)
      .filter(prevBrowser => prevBrowser !== browser)
      .subscribe(() => this.active.next(browser));
  }
}
