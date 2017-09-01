import {Injectable, Injector} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import {DEBOUNCE_TIME, SCREEN_WIDTH_BREAKPOINTS} from "../services/adaptive/adaptive.service";

declare let window: any;

export interface ScreenWidthSpec {
  max: number | null;
  name: string;
}

@Injectable()
export class ScreenWidthHelper {
  private activeNumber = new BehaviorSubject<number>(undefined);
  private activeName = new BehaviorSubject<string>(undefined);

  private breakpoints: ScreenWidthSpec[];

  constructor(private injector: Injector) {
    const debounceTime = injector.get(DEBOUNCE_TIME);
    this.breakpoints = injector.get(SCREEN_WIDTH_BREAKPOINTS);

    this.check();

    Observable
      .fromEvent(window, 'resize')
      .debounceTime(debounceTime)
      .subscribe(() => this.check());
  }

  private getScreenWidthName(width: number): string {
    const spec: ScreenWidthSpec = this.breakpoints
      .filter(spec => spec.max < width)
      .sort((a, b) => a.max - b.max)
      .pop();

    if (spec) {
      return spec.name;
    }
    else {
      const specWithoutMax: ScreenWidthSpec = this.breakpoints.find((spec: ScreenWidthSpec) => spec.max === null)

      return specWithoutMax.name;
    }
  }

  private getSpec(name: string): ScreenWidthSpec {
    const spec: ScreenWidthSpec = this.breakpoints.find((spec: ScreenWidthSpec) => spec.name === name);

    if (!spec) {
      throw new Error("Screen width spec " + name + " is not defined. Check your config.");
    }

    return spec;
  }

  private getMaxScreenWidth(name: string): number | null {
    const spec = this.getSpec(name);

    return spec.max;
  }

  private check() {
    const currentNumber: number = window.innerWidth;
    const currentName: string = this.getScreenWidthName(currentNumber);

    this
      .activeNumber
      .take(1)
      .filter(prevNumber => prevNumber !== currentNumber)
      .subscribe(() => this.activeNumber.next(currentNumber));

    this
      .activeName
      .take(1)
      .filter(prevName => prevName !== currentName)
      .subscribe(() => this.activeName.next(currentName));
  }

  private validateMaxNumber(width: number): Observable<boolean> {
    return this.activeNumber.map(active => active <= width);
  }

  private validateMinNumber(width: number): Observable<boolean> {
    return this.activeNumber.map(active => active > width);
  }

  private validateMaxName(name: string): Observable<boolean> {
    const maxWidth: number = this.getMaxScreenWidth(name);

    return this.validateMaxNumber(maxWidth);
  }

  private validateMinName(name: string): Observable<boolean> {
    const spec: ScreenWidthSpec = this.getSpec(name);
    const index: number = this.breakpoints.indexOf(spec);
    const prevSpec = this.breakpoints[index - 1];

    if (!prevSpec) {
      throw new Error('It does not make sense to specify your smallest breakpoint ' + name + ' as a minimum.');
    }

    return this.validateMinNumber(prevSpec.max + 1);
  }

  public validateMin(value: number | string): Observable<boolean> {
    if (typeof value === 'number') {
      return this.validateMinNumber(value);
    }
    else {
      return this.validateMinName(value);
    }
  }

  public validateMax(value: number | string): Observable<boolean> {
    if (typeof value === 'number') {
      return this.validateMaxNumber(value);
    }
    else {
      return this.validateMaxName(value);
    }
  }


  // private checkScreenWidth() {
  //   const spec = this.getScreenWidthSpec(window.innerWidth);
  //
  //   if (spec.name !== this.activeScreenWidth) {
  //     this.activeScreenWidth = spec.name;
  //     this.screenWidth.next(spec.name);
  //   }
  // }
  //
  // private getScreenWidthSpec(width: number): ScreenWidthSpec {
  //   return screenWidths.find(spec => {
  //     if (spec.min && width < spec.min) {
  //       return false;
  //     } else if (spec.max && width > spec.max) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   });
  // }
  //
  // private getScreenWidthSpecByName(name: ScreenWidth): ScreenWidthSpec {
  //   return screenWidths.find(spec => spec.name === name);
  // }
  //
  // private checkMinScreenWidth(min: ScreenWidth, active: ScreenWidth): boolean {
  //   const activeSpec = this.getScreenWidthSpecByName(active),
  //     minSpec = this.getScreenWidthSpecByName(min);
  //
  //   return screenWidths.indexOf(activeSpec) >= screenWidths.indexOf(minSpec);
  // }
  //
  // private checkMaxScreenWidth(max: ScreenWidth, active: ScreenWidth): boolean {
  //   const activeSpec = this.getScreenWidthSpecByName(active),
  //     maxSpec = this.getScreenWidthSpecByName(max);
  //
  //   return screenWidths.indexOf(activeSpec) <= screenWidths.indexOf(maxSpec);
  // }
}
