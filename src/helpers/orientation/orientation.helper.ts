import {Injectable, Injector} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import {Device} from "../device/device.helper";
import {DeviceHelper} from "../device/device.helper";
import {DEBOUNCE_TIME} from "../../injection-tokens";
import {WindowRefHelper} from "../window-ref/window-ref";

declare let window: any;

export type Orientation = 'landscape' | 'portrait';

@Injectable()
export class OrientationHelper {
  private active = new BehaviorSubject<Orientation>(undefined);

  constructor(injector: Injector, private windowRef: WindowRefHelper, private deviceHelper: DeviceHelper) {
    const debounceTime = injector.get(DEBOUNCE_TIME);

    deviceHelper.activeObservable
      .subscribe(device => this.check([device]));

    Observable
      .combineLatest(
        deviceHelper.activeObservable,
        Observable.fromEvent(windowRef.nativeWindow, 'orientationchange')
      )
      .debounceTime(debounceTime)
      .subscribe((data) => this.check(data));
  }

  private check(data: any) {
    const device: Device = data[0];
    const nativeWindow = this.windowRef.nativeWindow;

    let orientation: Orientation;

    if (device === 'desktop') {
      orientation = 'landscape';
    } else if (nativeWindow.screen && nativeWindow.screen['orientation']) {
      // window.screen.orientation is available on most browsers
      if (
        nativeWindow.screen['orientation'].type === 'portrait-primary' ||
        nativeWindow.screen['orientation'].type === 'portrait-secondary'
      ) {
        orientation = 'portrait';
      } else {
        orientation = 'landscape';
      }
    } else if (typeof nativeWindow.orientation === 'number') {
      // The window.orientation property is only available on iOS
      if (nativeWindow.orientation === 0 || nativeWindow.orientation === 180) {
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
