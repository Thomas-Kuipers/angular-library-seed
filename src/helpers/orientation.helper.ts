import {Injectable} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import {Orientation, Device} from "../";
import {DeviceHelper} from "./";

declare let window: any;

@Injectable()
export class OrientationHelper {
  private active = new BehaviorSubject<Orientation>(undefined);

  constructor(private deviceHelper: DeviceHelper) {
    Observable.combineLatest(
      deviceHelper.activeObservable,
      Observable.fromEvent(window, 'orientationchange')
    ).subscribe((data) => this.check(data));
  }

  private check(data: any) {
    const device: Device = data[0];

    let orientation: Orientation;

    if (device === 'desktop') {
      orientation = 'landscape';
    } else if (window.screen && window.screen['orientation']) {
      // window.screen.orientation is available on most browsers
      if (
        window.screen['orientation'].type === 'portrait-primary' ||
        window.screen['orientation'].type === 'portrait-secondary'
      ) {
        orientation = 'portrait';
      } else {
        orientation = 'landscape';
      }
    } else if (typeof window.orientation === 'number') {
      // The window.orientation property is only available on iOS
      if (window.orientation === 0 || window.orientation === 180) {
        orientation = 'portrait';
      } else {
        orientation = 'landscape';
      }
    } else {
      // If we have no way to detect, we assume landscape
      orientation = 'landscape';
    }

    this.active
      .take(1)
      .filter(prevOrientation => prevOrientation !== orientation)
      .subscribe(() => this.active.next(orientation));
  }

  public validate(test: Orientation): Observable<boolean> {
    return this.active.map(active => active === test);
  }
}
