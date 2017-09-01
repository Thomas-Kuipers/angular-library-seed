import {Injectable} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import {Orientation, Device} from "../services/adaptive/adaptive.service";
import {DeviceHelper} from "./device.helper";

declare let window: any;

@Injectable()
export class ScreenWidthHelper {
  private active = new BehaviorSubject<Orientation>(undefined);

  constructor() {

  }

  private check(data: any) {

    // this.active
    //   .take(1)
    //   .filter(prevOrientation => prevOrientation !== orientation)
    //   .subscribe(() => this.active.next(orientation));
  }

  public validate(test: Orientation): Observable<boolean> {
    return this.active.map(active => active === test);
  }
}
