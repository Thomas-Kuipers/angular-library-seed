import { async, TestBed, getTestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import { OrientationHelper } from './orientation.helper';
import { WindowRefHelper } from '../window-ref/window-ref';
import { Injector } from '@angular/core';
import { DeviceHelper } from '../device/device.helper';
import { DEBOUNCE_TIME } from '../../injection-tokens';

describe('OrientationHelper', () => {
  let orientationHelper: OrientationHelper;

  const configureTestbed = (windowProperties: any) => {
    const mockWindowRef: WindowRefHelper = {
      nativeWindow: Object.assign(
        {
          innerWidth,
          onresize: () => {},
          addListener: () => {},
          removeListener: () => {}
        },
        windowProperties
      )
    };

    class MockDeviceHelper {
      public activeObservable = Observable.of('tablet');
    }

    TestBed.configureTestingModule({
      providers: [
        OrientationHelper,
        Injector,
        WindowRefHelper,
        { provide: WindowRefHelper, useValue: mockWindowRef },
        { provide: DEBOUNCE_TIME, useValue: 0 },
        { provide: DeviceHelper, useClass: MockDeviceHelper }
      ]
    });

    const testBed = getTestBed();
    orientationHelper = testBed.get(OrientationHelper);
  };

  it(
    'should emit true when we test for portrait, and the user is in portrait (android style)',
    async(() => {
      configureTestbed({
        screen: {
          orientation: {
            type: 'portrait-primary'
          }
        }
      });

      orientationHelper
        .validate('portrait')
        .subscribe(result => expect(result).toBe(true));
    })
  );

  it(
    'should emit false when we test for portrait, but the user is in landscape (android style)',
    async(() => {
      configureTestbed({
        screen: {
          orientation: {
            type: 'landscape-primary'
          }
        }
      });

      orientationHelper
        .validate('portrait')
        .subscribe(result => expect(result).toBe(false));
    })
  );

  it(
    'should emit true when we test for landscape, and the user is in landscape (iOS style)',
    async(() => {
      configureTestbed({
        orientation: 90
      });

      orientationHelper
        .validate('landscape')
        .subscribe(result => expect(result).toBe(true));
    })
  );

  it(
    'should emit false when we test for landscape, but the user is in portrait (iOS style)',
    async(() => {
      configureTestbed({
        orientation: 0
      });

      orientationHelper
        .validate('landscape')
        .subscribe(result => expect(result).toBe(false));
    })
  );

  it(
    'should emit true when we test for landscape, and we have no way to detect orientation',
    async(() => {
      configureTestbed({});

      orientationHelper
        .validate('landscape')
        .subscribe(result => expect(result).toBe(true));
    })
  );
});
