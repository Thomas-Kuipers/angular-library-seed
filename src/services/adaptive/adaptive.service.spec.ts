import {
  async,
  TestBed,
  getTestBed
} from '@angular/core/testing';

import {AdaptiveService} from "./adaptive.service";
import {DeviceHelper} from "../../helpers/device/device.helper";
import {OrientationHelper} from "../../helpers/orientation/orientation.helper";
import {ScreenWidthHelper} from "../../helpers/screen-width/screen-width.helper";
import {Observable} from "rxjs/Observable";

describe('AdaptiveService', () => {
  let adaptiveService: AdaptiveService;

  const configureTestbed = (results: any) => {
    class MockDeviceHelper {
      validate() {
        return Observable.of(results.devices);
      }
    }

    class MockOrientationHelper {
      validate() {
        return Observable.of(results.orientation);
      }
    }

    class MockScreenWidthHelper {
      validateMin() {
        return Observable.of(results.minScreenWidth);
      }

      validateMax() {
        return Observable.of(results.maxScreenWidth);
      }
    }

    TestBed.configureTestingModule({
      providers: [
        AdaptiveService,
        { provide: DeviceHelper, useClass: MockDeviceHelper },
        { provide: OrientationHelper, useClass: MockOrientationHelper },
        { provide: ScreenWidthHelper, useClass: MockScreenWidthHelper },
      ]
    });

    const testBed = getTestBed();
    adaptiveService = testBed.get(AdaptiveService);
  };

  it('should emit true when all conditions are true', async(() => {
    configureTestbed({
      maxScreenWidth: true,
      minScreenWidth: true,
      orientation: true,
      devices: true
    });

    adaptiveService
      .validate({
        maxScreenWidth: 1,
        minScreenWidth: 1,
        orientation: 'portrait',
        devices: ['tablet']
      })
      .subscribe((result) => expect(result).toBe(true));
  }));

  it('should emit false when at least one of the conditions is false', async(() => {
    configureTestbed({
      maxScreenWidth: true,
      minScreenWidth: true,
      orientation: true,
      devices: false
    });

    adaptiveService
      .validate({
        maxScreenWidth: 1,
        minScreenWidth: 1,
        orientation: 'portrait',
        devices: ['tablet']
      })
      .subscribe((result) => expect(result).toBe(false));
  }));

  it('should emit true when an unspecified condition is false', async(() => {
    configureTestbed({
      maxScreenWidth: true,
      minScreenWidth: true,
      orientation: true,
      devices: false
    });

    adaptiveService
      .validate({
        maxScreenWidth: 1,
        minScreenWidth: 1,
        orientation: 'portrait'
      })
      .subscribe((result) => expect(result).toBe(true));
  }));

  it('should emit false when a custom boolean is false', async(() => {
    configureTestbed({});

    adaptiveService
      .validate({
        custom: [false]
      })
      .subscribe((result) => expect(result).toBe(false));
  }));

  it('should emit true when a custom boolean is true', async(() => {
    configureTestbed({});

    adaptiveService
      .validate({
        custom: [true]
      })
      .subscribe((result) => expect(result).toBe(true));
  }));

  it('should emit false when a custom function returns false', async(() => {
    configureTestbed({});

    adaptiveService
      .validate({
        custom: [() => false]
      })
      .subscribe((result) => expect(result).toBe(false));
  }));

  it('should emit true when a custom function returns true', async(() => {
    configureTestbed({});

    adaptiveService
      .validate({
        custom: [() => true]
      })
      .subscribe((result) => expect(result).toBe(true));
  }));

  it('should emit false when a custom observable emits false', async(() => {
    configureTestbed({});

    adaptiveService
      .validate({
        custom: [Observable.of(false)]
      })
      .subscribe((result) => expect(result).toBe(false));
  }));

  it('should emit true when a custom observable emits true', async(() => {
    configureTestbed({});

    adaptiveService
      .validate({
        custom: [Observable.of(true)]
      })
      .subscribe((result) => expect(result).toBe(true));
  }));

  it('should emit false when a custom promise resolves with false', async(() => {
    configureTestbed({});

    const promise = new Promise(resolve => {
      resolve(false);
    });

    adaptiveService
      .validate({
        custom: [promise]
      })
      .subscribe((result) => expect(result).toBe(false));
  }));

  it('should emit true when a custom promise resolves with true', async(() => {
    configureTestbed({});

    const promise = new Promise(resolve => {
      resolve(true);
    });

    adaptiveService
      .validate({
        custom: [promise]
      })
      .subscribe((result) => expect(result).toBe(true));
  }));

  it('should emit true when all conditions, including custom ones, return true', async(() => {
    configureTestbed({
      maxScreenWidth: true,
      minScreenWidth: true,
      orientation: true,
      devices: true
    });

    const promise = new Promise(resolve => {
      resolve(true);
    });

    adaptiveService
      .validate({
        maxScreenWidth: 1,
        minScreenWidth: 1,
        orientation: 'portrait',
        devices: ['tablet'],
        custom: [promise, Observable.of(true), true, () => true]
      })
      .subscribe((result) => expect(result).toBe(true));
  }));

  it('should emit false when only 1 custom condition is false, but everything else is true', async(() => {
    configureTestbed({
      maxScreenWidth: true,
      minScreenWidth: true,
      orientation: true,
      devices: true
    });

    // the custom promise is the only false value
    const promise = new Promise(resolve => {
      resolve(false);
    });

    adaptiveService
      .validate({
        maxScreenWidth: 1,
        minScreenWidth: 1,
        orientation: 'portrait',
        devices: ['tablet'],
        custom: [promise, Observable.of(true), true, () => true]
      })
      .subscribe((result) => expect(result).toBe(false));
  }));
});
