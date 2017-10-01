import {
  async,
  TestBed,
  getTestBed
} from '@angular/core/testing';

import {Injector} from '@angular/core';
import {AdaptiveService} from "./adaptive.service";
import {DeviceHelper} from "../../helpers/device/device.helper";
import {OrientationHelper} from "../../helpers/orientation/orientation.helper";
import {ScreenWidthHelper} from "../../helpers/screen-width/screen-width.helper";

describe('AdaptiveService', () => {
  let adaptiveService: AdaptiveService;

  const configureTestbed = () => {
    class MockDeviceHelper {

    }

    class MockOrientationHelper {

    }

    class MockScreenWidthHelper {

    }

    class MockInjector {
      public get(key) {
        return 'vfsdvdfs';
      }
    }

    TestBed.configureTestingModule({
      providers: [
        AdaptiveService,
        { provide: DeviceHelper, useClass: MockDeviceHelper },
        { provide: OrientationHelper, useClass: MockOrientationHelper },
        { provide: ScreenWidthHelper, useClass: MockScreenWidthHelper },
        { provide: Injector, useClass: MockInjector },
      ]
    });

    const testBed = getTestBed();
    adaptiveService = testBed.get(AdaptiveService);
  };

  it('should emit false when the screen is 200 and the max is 100', async(() => {
    configureTestbed();

    adaptiveService
      .validate({
        maxScreenWidth: 100
      })
      .subscribe((result) => expect(result).toBe(false));
  }));
});
