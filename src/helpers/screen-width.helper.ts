import {Injectable} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

declare let window: any;

@Injectable()
export class ScreenWidthHelper {
  private active = new BehaviorSubject<null>(undefined);

  constructor() {

  }

  private check(data: any) {

    // this.active
    //   .take(1)
    //   .filter(prevOrientation => prevOrientation !== orientation)
    //   .subscribe(() => this.active.next(orientation));
  }

  public validate(): Observable<boolean> {
    return this.active.map(active => active === 'a');
  }
}
