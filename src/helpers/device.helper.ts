import { Observable, ReplaySubject } from 'rxjs/Rx';
import {AdaptiveConditionInterface} from "./adaptive-condition.interface";
import {Orientation, Device} from "../services/adaptive/adaptive.service";
import * as MobileDetect from 'mobile-detect';

export class DeviceHelper implements AdaptiveConditionInterface {
  private active = new ReplaySubject<Device>();

  constructor() {
    this.check();
  }

  private check() {
    let device: Device;

    const md = new MobileDetect(window.navigator.userAgent);

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

  public validate(test: [Device]) {
    return this.active.map(active => test.indexOf(active) !== -1);
  }
}
