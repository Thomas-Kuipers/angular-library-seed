import { Observable, ReplaySubject } from 'rxjs/Rx';
import {AdaptiveConditionInterface} from "./adaptive-condition.interface";
import {Orientation, Device} from "../services/adaptive/adaptive.service";

export class OrientationHelper implements AdaptiveConditionInterface {
  private active = new ReplaySubject<Orientation>();

  constructor(device: Observable<Device>) {
    Observable.combineLatest(
      device,
      Observable.fromEvent(window, 'orientationchange')
    ).subscribe((data) => this.check(data));
  }

  private check(data) {
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
      .filter(oldOrientation => oldOrientation !== orientation)
      .subscribe(() => this.active.next(orientation));
  }

  public validate(test: Orientation) {
    return this.active.map(active => active === test);
  }
}
