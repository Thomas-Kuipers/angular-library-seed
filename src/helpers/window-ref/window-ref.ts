import { Injectable } from '@angular/core';

declare let window: any;

@Injectable()
export class WindowRefHelper {
  constructor() {}

  get nativeWindow() {
    return window;
  }
}
