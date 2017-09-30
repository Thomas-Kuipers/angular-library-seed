import {Injectable, Injector} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import {DEBOUNCE_TIME} from '../../services/adaptive/adaptive.service';

@Injectable()
export class ParentWidthHelper {
  private activeNumber = new BehaviorSubject<number>(undefined);

  constructor(injector: Injector) {
    const debounceTime = injector.get(DEBOUNCE_TIME);
  }

  public validateMin(value: number): Observable<boolean> {
    return Observable.of(true);
  }

  public validateMax(value: number): Observable<boolean> {
    return Observable.of(true);
  }
}
