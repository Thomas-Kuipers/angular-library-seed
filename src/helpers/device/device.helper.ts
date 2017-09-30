import {Injectable, Injector} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import {USER_AGENT_STRING} from "../../";
import * as MobileDetect from 'mobile-detect';

export type Device = 'mobile' | 'tablet' | 'desktop';

@Injectable()
export class DeviceHelper {
  private active = new BehaviorSubject<Device>(undefined);
  public activeObservable = this.active.asObservable();

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
  public validate(test: [Device]): Observable<boolean> {
    return this.active.map(active => test.indexOf(active) !== -1);
  }

  private check() {
    let device: Device;

    const md = new MobileDetect(this.userAgentString);

    if (md.tablet()) {
      device = 'tablet';
    } else if (md.mobile()) {
      device = 'mobile';
    } else {
      device = 'desktop';
    }

    this.active
      .take(1)
      .filter(prevDevice => prevDevice !== device)
      .subscribe(() => this.active.next(device));
  }
}
