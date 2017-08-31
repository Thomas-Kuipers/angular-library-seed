import { Observable, ReplaySubject } from 'rxjs/Rx';

export interface AdaptiveConditionInterface {
  validate: (test: any) => Observable<boolean>;
}
