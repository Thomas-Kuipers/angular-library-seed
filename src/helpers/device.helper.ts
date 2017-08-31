import {Injectable} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import {AdaptiveConditionInterface} from "./adaptive-condition.interface";
import {Device} from "../services/adaptive/adaptive.service";
import * as MobileDetect from 'mobile-detect';

@Injectable()
export class DeviceHelper implements AdaptiveConditionInterface {
  private active = new BehaviorSubject<Device>(undefined);
  public activeObservable = this.active.asObservable();

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

  public validate(test: [Device]): Observable<boolean> {
    return this.active.map(active => test.indexOf(active) !== -1);
  }
}
