import {Injectable, Injector} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import {Device, USER_AGENT_STRING} from "../";
import * as MobileDetect from 'mobile-detect';

@Injectable()
export class DeviceHelper {
  private active = new BehaviorSubject<Device>(undefined);
  public activeObservable = this.active.asObservable();

  private userAgentString: string;

  constructor(injector: Injector) {
    this.userAgentString = injector.get(USER_AGENT_STRING);
    this.check();
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

  public validate(test: [Device]): Observable<boolean> {
    return this.active.map(active => test.indexOf(active) !== -1);
  }
}
